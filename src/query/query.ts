import { jsonToGraphQLQuery } from "json-to-graphql-query";

import { IField } from "../decorators/field/IField";
import Class from '../util/Class';
import Logger from '../util/Logger';
import { findVariables, getParams, isValidParams } from "../util/Params";
import { iDef, nDef } from '../util/TypeUtils';

/**
 * Core functionality of the library.
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export const QUERY: string = "__query__";

// properties for json-to-graphql-query
const ALIAS_FOR: string = "__aliasFor";
const ARGS: string = "__args";
const DIRECTIVES: string = "__directives";
const VARIABLES: string = "__variables";

export enum QueryType {
	ONE = "one",
	MANY = "many",
	INLINE = "inline"
}

export enum MutationType {
	CREATE = "create",
	UPDATE = "update",
	DELETE = "delete"
}

export const setupQuery = (cls: any) => {
	if (nDef(cls[QUERY])) {
		cls[QUERY] = { fields: [] };
		return true;
	}
	return false;
};

export const isValidInstance = (instance: any) => (typeof instance === 'object' && typeof instance[QUERY] === 'object');

/**
 * parse a field
 * @param field
 * @param paramData
 * @param paramCallback
 * @param depth
 * @returns object with json-to-graphql-query properties
 */
const parseField = (field: IField, paramData: object, paramCallback: (params: any) => void, depth: number = 0) => {

	// schema object for field
	const f: any = {};

	// don't include this field
 if (typeof field.includeIf === 'function' && !field.includeIf(paramData)) {
		return false;
	}

	// 1. add the directive name if specified (lib only supports one directive per field at the moment)
	if (typeof field.directive === 'string') {
		f[DIRECTIVES] = { [field.directive]:  true };
	}

	// 2. add the params, if any specified
	if (isValidParams(field.params)) {
		const fieldParams = getParams<any, any>(field.params, paramData);
		if (Object.keys(fieldParams).length > 0) {
			f[ARGS] = fieldParams;
			paramCallback(fieldParams);
		}
	}

	// 3. add alias information
 if (iDef(field.aliasFor)) {
		f[ALIAS_FOR] = field.aliasFor;
	}

	// 4. if the field references another entity, add all of the entity fields to this object
	if (typeof field.entity !== 'undefined') {

		const instance = new field.entity();

		if (isValidInstance(instance)) {
			const args = instance[QUERY];
			depth++;

			args.fields.forEach((subfield: IField) => {
				f[subfield.name] = parseField(subfield, paramData, paramCallback, depth);
			});
		}
	}

	// 5. return the field schema object or just a boolean if no fields were added
	return Object.keys(f).length > 0 ? f : true;
};

/**
 * should return:
 * {
 *  [aliasOrName]: {
 *    ...entityFields
 *  }
 * }
 */
const setupSchema = (entityName: string, entity: Class, paramData: object, alias?: string) => {
	const instance = new entity();

	if (isValidInstance(instance)) {
		const args = instance[QUERY];
		const schema: any = {};
		const variables: any = {};

		// 1. determine the root field args
		const name: string = iDef(alias) ? alias : entityName;
		const aliasFor: string | undefined = iDef(alias) ? entityName : undefined; // this is the reverse of how it works in @Field
		const params = args.params === false ? {} : (isValidParams(args.params) ? args.params : paramData || {});

		// 2. set up the entity as a field on the schema
	 schema[name] = parseField({aliasFor, entity, name, params}, paramData || {},
				(fieldParams: any) => findVariables(fieldParams, (variable) => {
					const variableType = variable.getTypeString();

					if (iDef(variables[variable.value]) && variables[variable.value] !== variableType) {
						Logger.throw("duplicate.variable");
					}

					variables[variable.value] = variableType;
				}));


			// 3. if there are any variables, add to the schema
	 if (Object.keys(variables).length > 0) {
					schema[VARIABLES] = variables;
				}

		// 4. return the schema
	 return schema;
	}
};

export const generateQuery = (clazz: Class, type: QueryType, paramData?: object, alias?: string) => {
	const instance = new clazz();

	if (Object.values(QueryType).indexOf(type) < 0) {
		Logger.throw("invalid.query");
	}

	if (isValidInstance(instance)) {
		return jsonToGraphQLQuery({
			query: setupSchema(instance[QUERY][type], clazz, paramData, alias)
		});
	}

	Logger.throw("invalid.class");
};

export const generateMutation = (clazz: Class, type: MutationType, paramData?: object, alias?: string) => {
	const instance = new clazz();

	if (Object.values(MutationType).indexOf(type) < 0) {
		Logger.throw("invalid.mutation");
	}

	if (isValidInstance(instance)) {
		return jsonToGraphQLQuery({
			mutation: setupSchema(instance[QUERY][type], clazz, paramData, alias)
		});
	}

	Logger.throw("invalid.class");
};
