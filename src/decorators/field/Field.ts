import { QUERY, setupQuery } from '../../query/query';
import { iDef } from '../../util/TypeUtils';
import FieldArgs from './FieldArgs';
import { IField } from './IField';
import { IFieldArgs } from './IFieldArgs';

/**
 * Decorator to indicate a field to include in the query.
 * For full documentation: {@link https://www.devnet.io/libs/TypeGraph/}
 *
 * @author Joe Esposito <joe@devnet.io>
 */


const Field = (args?: IFieldArgs) => {
	const { aliasFor, directive, entity, params, query } = FieldArgs.parseArgs(args);

	return (cls: any, property: string) => {
		setupQuery(cls);
		cls[QUERY].fields.push({
			aliasFor,
			name: property,
			directive,
			entity,
			params,
			query
		} as IField);
	};
};

export default Field;
