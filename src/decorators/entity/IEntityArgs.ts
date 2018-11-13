import { ParamResolver } from "../../util/Params";

/**
 * Common arguments object passed to {@link Entity}
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export interface IEntityArgs<P = {}, V = {}> {
	one?: string;
	many?: string;
	create?: string;
	update?: string;
	delete?: string;

	params?: ParamResolver<P, V>;
}
