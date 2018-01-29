import * as types from '../types';

const numberTypes = ['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INTEGER', 'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'REAL'];
const dateTypes = ['DATE', 'DATEONLY', 'TIME', 'NOW'];
const enumTypes = ['ENUM'];
const booleanTypes = ['BOOLEAN'];

export const getType = schemaType => {
  if (numberTypes.includes(schemaType)) return types.NUMBER;
  if (dateTypes.includes(schemaType)) return types.DATE;
  if (enumTypes.includes(schemaType)) return types.ENUM;
  if (booleanTypes.includes(schemaType)) return types.BOOL;
  return types.STRING;
};
