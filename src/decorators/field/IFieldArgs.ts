import Class from "../../util/Class";
import { ParamResolver } from "../../util/Params";

/**
 * Common arguments object passed to {@link Field} decorator
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export interface IFieldArgs<Params = {}, QueryParams = {}> {
	aliasFor?: string;
	directive?: string;
	entity?: Class;
	params?: ParamResolver<Params, QueryParams>;
	query ?: string;
}
