const numberTypes = ['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INTEGER', 'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'REAL'];
const dateTypes = ['DATE', 'DATEONLY', 'TIME', 'NOW'];
const enumTypes = ['ENUM'];
const booleanTypes = ['BOOLEAN'];

module.exports = schemaType => {
  if (numberTypes.includes(schemaType)) return 'number';
  if (dateTypes.includes(schemaType)) return 'date';
  if (enumTypes.includes(schemaType)) return 'enum';
  if (booleanTypes.includes(schemaType)) return 'bool';
  return 'string';
};
