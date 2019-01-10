import { VariableModel } from "./Variables";

/**
 * utility for resolving param objects
 */

export type ParamsFn<P = {}, V = {}> = ((val: V) => P);
export type ParamResolver<P = {}, V = {}> = ParamsFn<P, V> | P;

function callParams<P, V>(params: ParamsFn<P, V>, val: V): P {
	return params(val);
}

export function getParams<P, V = {}>(params: ParamResolver<P, V> | boolean, queryParams: V): P {
	if (typeof params === 'function') {
		return callParams(params as ParamsFn<P, V>, queryParams);
	}
	return params as P;
}

export function isValidParams(params: any): boolean {
	return (typeof params === 'function' || typeof params === 'object');
}

export function findVariables(params: any, callback: (v: VariableModel) => void) {
	if (!params || typeof params !== 'object') {
		return false;
	}

	Object.entries(params).forEach(([_, v]) => {
		if (typeof v === 'object') {
			if (v instanceof VariableModel) {
				callback(v);
			} else {
				findVariables(v, callback);
			}
		}
	});
}
