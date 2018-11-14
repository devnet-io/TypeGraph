import Logger from '../../util/Logger';
import { isValidParams, ParamResolver } from '../../util/Params';
import { IEntityArgs } from './IEntityArgs';

/**
 * Parses and validates the common arguments object passed to {@link Entity}
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export default class EntityArgs {
	private static validFields = ["one", "many", "create", "update", "delete"];

	public static isValid(args: any): boolean {

		const errors = Object.keys(args).reduce((previous, field) => {

			// params is allowed
			if (field === "params") {
				return previous;
			}

			// only a certain set of fields are allowed
			if(EntityArgs.validFields.indexOf(field) < 0) {
				return previous += ("," + field);
			}

			// only string values are allowed
			if(typeof args[field] !== "string") {
				return  previous += ("," + field);
			}

			return previous;
		}, "");

	 Logger.warn(errors);

		return errors.length <= 0;
	}

	// TODO print specific errors for missing / incorrect fields
	public static parseArgs(arg1: any): EntityArgs {
		if (EntityArgs.isValid(arg1)) {
			return arg1 as EntityArgs; // no need make it using the constructor, the object we have is already valid.
		}

		Logger.throw("arguments.entity"); // args are essential, throw error instead of logging it

		return new EntityArgs();
	}

	public one: string | undefined;
	public many: string | undefined;
	public create?: string | undefined;
	public update?: string | undefined;
	public delete?: string | undefined;
	public params?: ParamResolver | boolean | undefined;

	constructor(one?: string, many?: string, params?: ParamResolver) {
		this.one = one;
		this.many = many;
		this.params = params;
	}

	public isValid(): boolean {
		return EntityArgs.isValid(this);
	}
}
