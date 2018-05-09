import Logger from '../../util/Logger';

/**
 * Parses and validates the common arguments object passed to {@link Entity}
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export default class EntityArgs {

	public static isValid(args: any): boolean {
		return typeof args === 'object' && (
			(typeof args.one === 'string' && typeof args.one === 'undefined') ||
			(typeof args.one === 'undefined' && typeof args.many === 'string') ||
			(typeof args.one === 'string' && typeof args.many === 'string')
		);
	}

	public static parseArgs(arg1: any): EntityArgs {
		if (EntityArgs.isValid(arg1)) {
			return new EntityArgs(arg1.one, arg1.many);
		}

		Logger.throw("arguments.entity"); // args are essential throw error instead of logging it

		return new EntityArgs();
	}

	public one: string | undefined;
	public many: string | undefined;

	constructor(one?: string, many?: string) {
		this.one = one;
		this.many = many;
	}

	public isValid(): boolean {
		return EntityArgs.isValid(this);
	}
}
