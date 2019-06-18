
export interface IOperationOptions {
	name?: string;
}

export interface IOperationArgs extends IOperationOptions {
	type: "query" | "mutation" | "subscription"; // = "query"
}
