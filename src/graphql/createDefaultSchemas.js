const {
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType
} = require('graphql/type');

module.exports = ({ ast, restforSchema, schema }) => {
  const typeNames = Object.keys(restforSchema);
  const Date = createDateScalar();
  const Operator = createOperator();
  const Predicate = createPredicate(Date, Operator);
  const commonTypes = { Date, Operator, Predicate };
  const context = { commonTypes, typeNames, restforSchema, schema };
  return [Date, Operator, Predicate];
};

const DEFAULT_PRIMARY_KEY_NAME = 'id';
const DEFAULT_PRIMARY_KEY_TYPE = GraphQLInt;
const DEFAULT_LIMIT = 10;

const EQ = 'eq';
const GT = 'gt';
const GTE = 'gte';
const LT = 'lt';
const LTE = 'lte';
const IN = 'in';
const CONTAINS = 'contains';

const PRIMARY_KEY_DIRECTIVE = 'primaryKey';
const AUTO_GENERATE_DIRECTIVE = 'auto';

const nonEditableDecoratorNames = [PRIMARY_KEY_DIRECTIVE, AUTO_GENERATE_DIRECTIVE];

const getTypeDefinition = (ast, typeName) => ast.definitions.find(definition => definition.name.value === typeName);

const getFieldType = (schema, ast, typeName, fieldOrfieldPredicate) => {
  const objectDefinition = getTypeDefinition(ast, typeName);
  if (!objectDefinition) throw new Error(`Type not found: ${typeName}`);
  const fieldPredicate = typeof fieldOrfieldPredicate === 'string'
    ? field => field.name.value === fieldOrfieldPredicate
    : fieldOrfieldPredicate;
  const field = objectDefinition.fields.find(fieldPredicate);
  if (!field) throw new Error('Field not found by the given predicate');
  const type = schema._typeMap[field.type.name.value];
  if (!type) throw new Error(`Invalid field type: ${field.type.name.value}`);
  return type;
};

const getPrimaryKeyName = (ast, typeName) => {
  const objectDefinition = getTypeDefinition(ast, typeName);
  if (!objectDefinition) return DEFAULT_PRIMARY_KEY_NAME;
  const primaryKeyField = objectDefinition.fields.find(field =>
    field.directives.some(directive => directive.name.value === PRIMARY_KEY_DIRECTIVE)
  );
  return primaryKeyField ? primaryKeyField.name.value : DEFAULT_PRIMARY_KEY_NAME;
};

const getPrimaryKeyType = (schema, ast, typeName) => {
  try {
    return getFieldType(schema, ast, typeName, field =>
      field.directives.some(directive => directive.name.value === PRIMARY_KEY_DIRECTIVE)
    );
  } catch (error) {
    return DEFAULT_PRIMARY_KEY_TYPE;
  }
};

const getDelta = (schema, ast, typeName) => {
  const objectDefinition = getTypeDefinition(ast, typeName);
  const freeFields = objectDefinition.fields
    .filter(field => field.directives.every(directive => !nonEditableDecoratorNames.includes(directive.name.value)))
    .map(field => field.name.value);
  return new GraphQLInputObjectType({
    name: `${typeName}Delta`
  });
};

const createOperator = () =>
  new GraphQLEnumType({
    name: 'Operator',
    values: {
      eq: { value: EQ },
      gt: { value: GT },
      lt: { value: LT },
      gte: { value: GTE },
      lte: { value: LTE },
      in: { value: IN },
      contains: { value: CONTAINS }
    }
  });

const createPredicate = (Date, Operator) =>
  new GraphQLObjectType({
    name: 'Predicate',
    fields: {
      field: { type: GraphQLString },
      value: {
        type: new GraphQLUnionType({
          name: 'PredicateValue',
          types: [
            GraphQLID,
            new GraphQLList(GraphQLID),
            GraphQLInt,
            new GraphQLList(GraphQLInt),
            GraphQLFloat,
            new GraphQLList(GraphQLFloat),
            GraphQLString,
            new GraphQLList(GraphQLString),
            GraphQLBoolean,
            new GraphQLList(GraphQLBoolean),
            Date,
            new GraphQLList(Date)
          ]
        })
      },
      operator: { type: Operator, defaultValue: 'eq' }
    }
  });

const createDateScalar = () =>
  new GraphQLScalarType({
    name: 'Date',
    description: 'DateTime scalar',
    serialize: value => value
  });

const createSchema = context =>
  new GraphQLSchema({
    query: createQuery(context),
    mutation: createMutation(context)
  });

const createQuery = context =>
  new GraphQLObjectType({
    name: 'Query',
    fields: context.typeNames.reduce(
      (query, typeName) => ({
        ...query,
        [typeName]: { type: createEntityQuery(context, typeName), resolve: () => ({}) }
      }),
      {}
    )
  });

const createMutation = context =>
  new GraphQLObjectType({
    name: 'Mutation',
    fields: context.typeNames.reduce(
      (query, typeName) => ({
        ...query,
        [typeName]: { type: createMutationQuery(context, typeName), resolve: () => ({}) }
      }),
      {}
    )
  });

const createEntityQuery = (context, typeName) => {
  const primaryKeyName = getPrimaryKeyName(context.ast, typeName);
  const primaryKeyType = getPrimaryKeyType(context.schema, context.ast, typeName);
  return new GraphQLObjectType({
    name: `${typeName}Query`,
    fields: {
      items: {
        type: new GraphQLList(context.schema._typeMap[typeName]),
        args: {
          query: { type: new GraphQLList(context.commonTypes.Predicate) },
          sort: { type: GraphQLString, defaultValue: primaryKeyName },
          offset: { type: GraphQLInt, defaultValue: 0 },
          limit: { type: GraphQLInt, defaultValue: DEFAULT_LIMIT }
        },
        resolver: () => 'items'
      },
      item: {
        type: context.schema._typeMap[typeName],
        args: {
          [primaryKeyName]: { type: primaryKeyType }
        },
        resolver: () => 'item'
      }
    }
  });
};

const createMutationQuery = (context, typeName) => {
  const primaryKeyName = getPrimaryKeyName(context.ast, typeName);
  const primaryKeyType = getPrimaryKeyType(context.schema, context.ast, typeName);
  return new GraphQLObjectType({
    name: `${typeName}Mutation`,
    fields: {
      create: {
        type: context.schema._typeMap[typeName],
        args: {},
        resolver: () => 'create'
      },
      update: {
        type: context.schema._typeMap[typeName],
        args: { [primaryKeyName]: { type: primaryKeyType } },
        resolver: () => 'update'
      },
      delete: { args: { ids: { type: new GraphQLList(primaryKeyType) } }, resolver: () => 'delete' }
    }
  });
};
