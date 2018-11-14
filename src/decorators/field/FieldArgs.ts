import Logger from '../../util/Logger';
import { ParamResolver } from '../../util/Params';
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
			(typeof args.aliasFor === 'undefined' || typeof args.aliasFor === 'string') &&
			(typeof args.directive === 'undefined' || typeof args.directive === 'string') &&
			(typeof args.entity === 'undefined' || typeof args.entity === 'function') &&
			(
				typeof args.params === 'undefined' ||
				typeof args.params === 'boolean' ||
				typeof args.params === 'object' ||
				typeof args.params === 'function'
			) &&
			(typeof args.query === 'undefined' || typeof args.query === 'string')
		));
	}

	public static parseArgs(args: any, thow: boolean = true): FieldArgs {

		if (thow && !FieldArgs.isValid(args)) {
			Logger.throw("arguments.field"); // id is essential, throw error instead of logging it
		}

		if (typeof args === 'undefined') { // id from string
			return new FieldArgs();
		}

		if (typeof args === 'object') {
			return new FieldArgs(args.aliasFor, args.entity, args.query, args.params, args.directive);
		}
	}

	public aliasFor: string | undefined;
	public directive: string | undefined;
	public entity: any | undefined;
	public params: ParamResolver | undefined;
	public query: string | undefined;

	constructor(aliasFor?: string, entity?: any, query?: string, params?: any, directive?: string) {
		this.aliasFor = aliasFor;
		this.directive = directive;
		this.entity = entity;
		this.params = params;
		this.query = query;
	}

	public isValid(): boolean {
		return FieldArgs.isValid(this);
	}
}
