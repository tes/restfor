export const BOOL = 'bool';
export const NUMBER = 'number';
export const STRING = 'string';
export const ENUM = 'enum';
export const DATE = 'date';

export const typeConstructors = {
  bool: () => ({ type: BOOL }),
  number: () => ({ type: NUMBER }),
  string: () => ({ type: STRING }),
  enum: (...values) => ({ type: ENUM, values }),
  date: () => ({ type: DATE })
};
