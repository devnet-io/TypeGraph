/**
 * Helper to get current application mode
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export enum Mode {
	DEV,
	PRODUCTION
}

declare var process: any;

const getMode = (): Mode => {
	return (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? Mode.DEV : Mode.PRODUCTION;
};

export class EnvMode {
	private mode: Mode;

	constructor() {
		this.mode = getMode();
	}

	public get() {
		return this.mode;
	}

	public isDev() {
		return this.mode === Mode.DEV;
	}

	public isProd() {
		return this.mode === Mode.PRODUCTION;
	}
}

export const currentMode = new EnvMode();
