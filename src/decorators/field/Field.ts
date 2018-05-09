import { QUERY, setupQuery } from '../../query/query';
import { iDef } from '../../util/TypeUtils';
import FieldArgs from './FieldArgs';
import { IFieldArgs } from './IFieldArgs';

/**
 * Decorator to indicate a field to include in the query.
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 * 
 * @author Joe Esposito <joe@devnet.io>
 */

const Field = (params?: IFieldArgs) => {
	const { alias, entity, query } = FieldArgs.parseArgs(params);

	return (cls: any, property: string) => {
		setupQuery(cls);
		cls[QUERY].fields.push({name: iDef(alias) ? alias : property, entity, query});
	};
};

export default Field;
