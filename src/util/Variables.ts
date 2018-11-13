import { EnumType, VariableType } from "json-to-graphql-query";
import { iDef } from "./TypeUtils";

/**
 * extending VariableType from jsonToGraphqlQuery to provide some metadata
 */
export class VariableModel extends VariableType {

	public value: string;
	public type: string;
	public required: boolean;
	public defaultValue: string;

	constructor(value: string, type: string, required: boolean = false, defaultValue?: any) {
		super(value);

		this.type = type;
		this.required = required;
		this.defaultValue = defaultValue;
	}

	public getTypeString(): string {
		return this.type
			+ (this.required === true ? '!' : '')
			+ (iDef(this.defaultValue) ? ' = ' + (typeof this.defaultValue === 'string' ? `"${this.defaultValue}"` : this.defaultValue) : '');
	}

}

/**
 * automatically add a variable to the root query
 * @param value - variable name
 * @param type - variable type name as string (e.g. String)
 * @param required - if true, will append a ! after the type name
 * @param defaultValue - if true will append `= ${defaultValue}` to the variable definition
 */
export const addVariable = (value: string, type: string, required?: boolean, defaultValue?: any) => new VariableModel(value, type, required, defaultValue);

/**
 * render a parameter value as an enum
 * @param value value to be rendered into the query as an enum
 */
export const addEnum = (value: string) => new EnumType(value);
