/**
 * Feedback messages dictionary
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

const dictionary: any = {
	arguments: {
		entity: "Invalid arguments provided to @Entity decorator. See: https://www.devnet.io/libs/TypeGraph/ for valid arguments.",
		field: "Invalid arguments provided to @Field decorator. See: https://www.devnet.io/libs/TypeGraph/ for valid arguments."
	},
	invalid : {
		type: "Invalid QueryType provided to generateQuery. See: https://www.devnet.io/libs/TypeGraph/ for valid types.",
		class: "Invalid class supplied. Is it decorated with @Entity and at least one @Field?"
	}
};

export default dictionary;
