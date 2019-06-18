import { jsonToGraphQLQuery } from "json-to-graphql-query";

import { IField } from "../decorators/field/IField";
import Class from "../util/Class";
import Logger from "../util/Logger";
import { findVariables, getParams, ParamResolver } from "../util/Params";

const QUERY = "__query__";

/**
 * recursively parses field data
 * @param field
 * @param data
 * @param callback
 * @param depth
 * @returns
 *  false -> field should be excluded from query string
 *  true -> field is just a primitive with no special stuff
 *  object -> field has extra metadata to evaluate
 */
function __parseField(field: IField, data: object = {}, callback: (data: any) => void): boolean | object {

  /**
   * if field's includeIf method evaluates to false, exclude this field from the query
   */
  if (typeof field.includeIf === 'function' && !field.includeIf(data)) {
    return false;
  }

  /**
   * object for collecting field data
   */
  const o: any = {};

  /**
   * if this field is an alias for a field on the type, add the alias info
   */
  if (!!field.aliasFor) {
    o.__aliasFor = field.aliasFor;
  }

  /**
   * if a directive is specified, add the directive
   * @todo support multiple directives?
   */
  if (!!field.directive) {
    o.__directive = { [field.directive]: true };
  }

  if (typeof field.params === 'object' || typeof field.params === 'function') {
    const args = getParams(field.params, data);

    /**
     * if there ended up being any params/args for this field, add them
     */
    if (!!args && Object.keys(args).length > 0) {
      o.__args = args;

      /**
       * call callback function from __generate to add the variables to the root
       */
      callback(args);
    }
  }

  /**
   * if this field uses sub selection, add all of the fields
   */
  if (typeof field.entity === 'function') {
    const instance = new field.entity();

    const fields: IField[] = instance[QUERY] && instance[QUERY].fields || [];

    for (const subField of fields) {
      o[subField.name] = __parseField(subField, data, callback);
    }
  }

  /**
   * if there is any metadata defined, return the object, else just return true
   */
  return Object.keys(o).length > 0 ? o : true;
}

/**
 * generate a graphql query string
 *
 * @param type operation type
 * @param data external data object for evaluating param resolvers
 * @param fields root level fields to add to the query
 * @param name operation name (optional)
 */
function __generate(
  type: "query" | "mutation" | "subscription" = "query",
  data: object = {},
  fields: IField[] = [],
  name?: string
): string {

  /**
   * object containing root level fields
   */
  const schema: any = {};

  /**
   * callback adds variable definitions to this object during field recursion
   * */
  const variables: any = {};

  const callback = (d: any) => {
    // find all of the variables
    findVariables(d, (variable) => {

      const variableType = variable.getTypeString();

      /**
       * throw exception if the same variable was added elsewhere in the query
       * with a different type
       * */
      if (!!variables[variable.value] && variables[variable.value] !== variableType) {
        Logger.throw("duplicate.variable");
      }

      /**
       * add the variable definition if valid
       * */
      variables[variable.value] = variableType;
    });
  };

  /**
   * add all of the root-level fields
   */
  for (const field of fields) {
    schema[field.name] = __parseField(field, data, callback);
  }

  /**
   * if there are any variables defined, add them to the schema.
   */
  if (Object.keys(variables).length > 0) {
    schema.__variables = variables;
  }

  /**
   * generate the query string
   */
  const str = jsonToGraphQLQuery({[type]: schema});

  /**
   * if an operation name was provided, insert it
   * jsonToGraphQLQuery does not support this at the moment
   */
  return !!name ? str.slice(0, type.length) + ' ' + name + str.slice(type.length) : str;
}

/**
 * generate a root graphql query string (multi field)
 *
 * @param clazz root graphql query class
 * @param data external data object for evaluating param resolvers
 */
function generate(clazz: Class, data: object): string {

  const instance = new clazz();

  const { fields = [], operation = {} } = (instance[QUERY] || {});

  const { type = "query", name = clazz.name } = operation;

  return __generate(type, data, fields, name);
}


interface IFieldMeta {
  name: string;
  aliasFor?: string;
  params?: ParamResolver;
}

/**
 * shorthand for single root field operations to avoid writing wrapper class
 *
 * @param entity the decorated class to use as the only field on the query
 * @param data external data object for evaluating param resolvers
 * @param field field name + alias
 * @param name operation name (optional)
 * @returns generated graphql query string
 **/
generate.query = (entity: Class, data: object, field: IFieldMeta, name?: string) => {
  return __generate("query", data, [{...field, entity}], name);
};

generate.mutation = (entity: Class, data: object, field: IFieldMeta, name?: string) => {
  return __generate("mutation", data, [{...field, entity}], name);
};

generate.subscription = (entity: Class, data: object, field: IFieldMeta, name?: string) => {
  return __generate("subscription", data, [{...field, entity}], name);
};

export default generate;
