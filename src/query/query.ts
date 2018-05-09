import graphqlify from 'graphqlify';

import Class from '../util/Class';
import Logger from '../util/Logger';
import { currentMode } from "../util/Mode";
import { nDef } from '../util/TypeUtils';

/**
 * Core functionality of the library.
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export const QUERY: string = "__query__";

export enum QueryType { ONE, MANY, INLINE }

export const setupQuery = (cls: any) => {
	if (nDef(cls[QUERY])) {
		cls[QUERY] = { fields: [] };
		return true;
	}
	return false;
};

export const generateQuery = (clazz: Class, type: QueryType, params?: object, depth: number = 0): string => {
	const instance = new clazz();
	const query: any = { fields: { } as any};
	depth++;

	if (typeof instance === 'object' && typeof instance[QUERY] === 'object') {
		const args = instance[QUERY] as any;

		if (typeof params !== 'undefined') {
			query.params = params;
		}

		// loop through decorated fields
		args.fields.forEach((f: any) => {

			if (depth < 10 || typeof f.entity === 'undefined') {

				if (typeof f.entity !== 'undefined') {
					query.fields[f.name] = generateQuery(f.entity, QueryType.INLINE, undefined, depth);
				} else {
					query.fields[f.name] = {};
				}

			} else {
				console.warn("Maximum query depth exceeded");
			}
		});

		if (type === QueryType.INLINE) {
			// keep as object for use in parent query
			return query;
		} else if (type === QueryType.ONE) {
			// create one query
			return graphqlify({ [args.one]: query });
		} else if (type === QueryType.MANY) {
			// create many query
			return graphqlify({ [args.many]: query });
		}
		
		Logger.throw("invalid.type");
	}

	Logger.throw("invalid.class");
};
