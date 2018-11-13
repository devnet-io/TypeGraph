/**
 * Helper functions for checking if variables are undefined
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export function iDef(o: any) { return typeof o !== "undefined"; }

export function nDef(o: any) { return typeof o === "undefined"; }

// conditional assign
export function cAsgn(to: any, from: any) {
	if(iDef(from)) {
		to = from;
	}
}
