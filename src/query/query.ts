import graphqlify from 'graphqlify';

import Class from '../util/Class';
import Logger from '../util/Logger';
import { currentMode } from "../util/Mode";
import { iDef, nDef } from '../util/TypeUtils';

/**
 * Core functionality of the library.
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export const QUERY: string = "__query__";

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

export const generateMutation = (clazz: Class, type: MutationType, fields: object, params?: object, alias?: string): string => {
	const instance = new clazz();

	if(Object.values(MutationType).indexOf(type) < 0) {
		Logger.throw("invalid.mutation");
	}

	if (typeof instance === 'object' && typeof instance[QUERY] === 'object') {
		const args = instance[QUERY] as any;
		const name = iDef(alias) ? alias + ":" + args[type] : args[type];

		// construct the query
		const query = {
			[name] : { 
				fields
			}
		} as any;

		// add the params if received
		if (iDef(params)) {
			query[name].params = params;
		}

		// pass it graphqlify then prefix
		return "mutation" + graphqlify(query);
	}

	Logger.throw("invalid.class");
};

export const generateQuery = (clazz: Class, type: QueryType, params?: object, alias?: string, depth: number = 0): string => {
	const instance = new clazz();
	let query: any = { fields: { } as any};
	depth++;

	if(Object.values(QueryType).indexOf(type) < 0) {
		Logger.throw("invalid.query");
	}

	if (typeof instance === 'object' && typeof instance[QUERY] === 'object') {
		const args = instance[QUERY] as any;

		if (iDef(params)) {
			query.params = params;
		}

		// loop through decorated fields
		args.fields.forEach((f: any) => {

			if (depth < 10 || typeof f.entity === 'undefined') {

				if (typeof f.entity !== 'undefined') {
					query.fields[f.name] = generateQuery(f.entity, QueryType.INLINE, undefined, undefined, depth);
				} else {
					query.fields[f.name] = {};
				}

			} else {
				console.warn("Maximum query depth exceeded");
			}
		});

		/* if(iDef(alias)) {
			query.field = alias;
		} */

		if (QueryType.INLINE === type) {
			// keep as object for use in parent query
			return query;
		}

		// alias the query if needed
		const name = iDef(alias) ? alias + ":" + args[type] : args[type];

		// create the final query object
		query = { [name]: query };

		// pass it graphqlify then prefix
		return "query" + graphqlify(query);
	}

	Logger.throw("invalid.class");
};
