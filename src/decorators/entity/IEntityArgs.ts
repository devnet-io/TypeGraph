/**
 * Common arguments object passed to {@link Entity}
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export interface IEntityArgs {
	one?: string;
	many?: string;
	create?: string;
	update?: string;
	delete?: string;
}
