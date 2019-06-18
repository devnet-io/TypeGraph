import Logger from "../../util/Logger";
import { nDef } from "../../util/TypeUtils";
import { IOperationArgs } from "./IOperationArgs";


export default class OperationArgs implements IOperationArgs {

	public static isValid(args: any = {}): boolean {
		return (
			args.type === 'query' ||
			args.type === 'mutation' ||
			args.type === 'subscription'
		) && (
			nDef(args.name) || typeof args.name === 'string'
		);
	}

	public static parseArgs(arg1: any): OperationArgs {
		if (OperationArgs.isValid(arg1)) {
			return new OperationArgs(arg1.type, arg1.name);
		}
		Logger.throw("arguments.operation");
	}

	public type: "query" | "mutation" | "subscription";
	public name?: string;

	private constructor(type: "query" | "mutation" | "subscription", name?: string) {
		this.type = type;
		this.name = name;
	}
}
