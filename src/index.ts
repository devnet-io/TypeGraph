/**
 * Index to expose modules
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */

export { default as Entity } from './decorators/entity/Entity';
export { default as Field } from './decorators/field/Field';
export { addEnum, addVariable } from "./util/Variables";
export { generateQuery, QueryType, generateMutation, MutationType } from './query/query';
