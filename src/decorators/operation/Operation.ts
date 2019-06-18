import { QUERY } from "../../query/query";
import { IOperationArgs, IOperationOptions } from "./IOperationArgs";
import OperationArgs from "./OperationArgs";

export default function Operation(args: IOperationArgs) {
	const operation = OperationArgs.parseArgs(args);

	return (cls: any) => {
		cls.prototype[QUERY] = {...cls.prototype[QUERY], operation};
		return cls;
	};
}

Operation.Query = (options: IOperationOptions = {}) => Operation({...options, type: 'query'});
Operation.Mutation = (options: IOperationOptions = {}) => Operation({...options, type: 'mutation'});
Operation.Subscription = (options: IOperationOptions = {}) => Operation({...options, type: 'subscription'});
