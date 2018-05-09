import { QUERY } from '../../query/query';
import EntityArgs from './EntityArgs';
import { IEntityArgs } from './IEntityArgs';

/**
 * Decorator to indicate top level object in query
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

const Entity = (params: IEntityArgs) => {
	const args = EntityArgs.parseArgs(params);

	return (cls: any) => {
		cls.prototype[QUERY] = {...cls.prototype[QUERY], ...args};
		return cls;
	};
};

export default Entity;
