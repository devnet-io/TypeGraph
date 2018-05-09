/* tslint:disable:no-console */

import * as lodash from 'lodash';

import dictionary from './dictionary';
import { currentMode, Mode } from './Mode';

/**
 * Handles output of feedback messages
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

export default class Logger {
	private static PREFIX: string = "TypeGraph - ";

	public static getMessage(key: string): string {
		const message: string = lodash.get(dictionary, key);

		if(typeof message !== "undefined") {
			return Logger.PREFIX + message;
		}

		return Logger.PREFIX + key;
	}

	public static throw(key: string): void {
		throw Error(Logger.getMessage(key));
	}

	public static error(key: string): void {
		const message: string = "Error: " + Logger.getMessage(key);

		if(message && window.console) {
			console.error(message);
		}
	}

	public static debug(key: string): void {
		const message: string = "Error: " + Logger.getMessage(key);

		if(message && window.console) {
			console.debug(key);
		}
	}

	public static warn(key: string): void {
		// Only show warnings when not in production mode
		if (currentMode.isDev()) {
			const message: string = "Warning: " + Logger.getMessage(key);
			
			if(message && window.console) {
				console.warn(message);
			}
		}
	}
}
