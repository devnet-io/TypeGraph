import Logger from '../../util/Logger';
import { IFieldArgs } from './IFieldArgs';

/**
 * Parses and validates the common arguments object passed to {@link Field} decorator
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export default class FieldArgs implements IFieldArgs {

	public static isValid(args: any): boolean {
		return typeof args === 'undefined' || (typeof args === 'object' && (
			(typeof args.alias === 'undefined' || typeof args.alias === 'string') &&
			(typeof args.entity === 'undefined' || typeof args.entity === 'function') &&
			(typeof args.query === 'undefined' || typeof args.query === 'string')
		));
	}

	public static parseArgs(params: any, thow: boolean = true): FieldArgs {

		if (thow && !FieldArgs.isValid(params)) {
			Logger.throw("arguments.field"); // id is essential, throw error instead of logging it
		}

		if (typeof params === 'undefined') { // id from string
			return new FieldArgs();
		}

		if (typeof params === 'object') {
			return new FieldArgs(params.alias, params.entity, params.query);
		}		
	}

	public alias: string | undefined;
	public entity: any | undefined;
	public query: string | undefined;

	constructor(alias?: string, entity?: any, query?: string) {
		this.alias = alias;
		this.entity = entity;
		this.query = query;
	}

	public isValid(): boolean {
		return FieldArgs.isValid(this);
	}
}
