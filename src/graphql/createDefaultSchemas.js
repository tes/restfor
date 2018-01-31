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

const { op, directive, DEFAULT_PRIMARY_KEY_NAME, DEFAULT_PRIMARY_KEY_TYPE, DEFAULT_LIMIT } = require('./consts');
const getDefaultValue = require('./getDefaultValue');

module.exports = ({ ast, restforSchema, schema }) => {
  const typeNames = Object.keys(restforSchema);
  const Operator = createOperator();
  const Predicate = createPredicate(Operator);
  const ItemsQuery = createItemsQuery(Predicate);
  const deltas = typeNames.reduce(
    (deltas, typeName) => ({
      ...deltas,
      [typeName]: createDelta(schema, ast, typeName)
    }),
    {}
  );
  const commonTypes = { Operator, Predicate, ItemsQuery };
  const context = { ast, commonTypes, deltas, typeNames, restforSchema, schema };
  const entrySchema = createSchema(context);
  return entrySchema;
};

const nonEditableDecoratorNames = [directive.PRIMARY_KEY, directive.AUTO_GENERATE];

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
    field.directives.some(directive => directive.name.value === directive.PRIMARY_KEY)
  );
  return primaryKeyField ? primaryKeyField.name.value : DEFAULT_PRIMARY_KEY_NAME;
};

const getPrimaryKeyType = (schema, ast, typeName) => {
  try {
    return getFieldType(schema, ast, typeName, field =>
      field.directives.some(directive => directive.name.value === directive.PRIMARY_KEY)
    );
  } catch (error) {
    return DEFAULT_PRIMARY_KEY_TYPE;
  }
};

const createDelta = (schema, ast, typeName) => {
  const objectDefinition = getTypeDefinition(ast, typeName);
  const freeFields = objectDefinition.fields
    .filter(field => field.directives.every(directive => !nonEditableDecoratorNames.includes(directive.name.value)))
    .map(field => field);
  return new GraphQLInputObjectType({
    name: `${typeName}Delta`,
    fields: freeFields.reduce(
      (fields, field) => ({
        ...fields,
        [field.name.value]: {
          type: getFieldType(schema, ast, typeName, field.name.value),
          defaultValue: getDefaultValue(field.directives)
        }
      }),
      {}
    )
  });
};

const createOperator = () =>
  new GraphQLEnumType({
    name: 'Operator',
    values: {
      [op.EQ]: { value: op.EQ },
      [op.GT]: { value: op.GT },
      [op.LT]: { value: op.LT },
      [op.GTE]: { value: op.GTE },
      [op.LTE]: { value: op.LTE },
      [op.IN]: { value: op.IN },
      [op.CONTAINS]: { value: op.CONTAINS }
    }
  });

const createItemsQuery = Predicate => new GraphQLList(Predicate);

const createPredicate = Operator =>
  new GraphQLInputObjectType({
    name: 'Predicate',
    fields: {
      field: { type: GraphQLString },
      value: { type: GraphQLInt },
      operator: { type: Operator, defaultValue: op.EQ }
    }
    /* types: [
      new GraphQLInputObjectType({
        name: 'IntPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: GraphQLInt },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'IntListPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: new GraphQLList(GraphQLInt) },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'FloatPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: GraphQLFloat },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'FloatListPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: new GraphQLList(GraphQLFloat) },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'IDPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: GraphQLID },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'IDListPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: new GraphQLList(GraphQLID) },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'BoolPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: GraphQLBoolean },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'BoolListPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: new GraphQLList(GraphQLBoolean) },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'StringPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: GraphQLString },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      }),
      new GraphQLInputObjectType({
        name: 'StringListPredicate',
        fields: {
          field: { type: GraphQLString },
          value: { type: new GraphQLList(GraphQLString) },
          operator: { type: Operator, defaultValue: op.EQ }
        }
      })
    ] */
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
        [typeName.toLowerCase()]: { type: createEntityQuery(context, typeName), resolve: () => ({}) }
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
        [typeName.toLowerCase()]: { type: createMutationQuery(context, typeName), resolve: () => ({}) }
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
          filter: { type: GraphQLString, defaultValue: '' },
          sort: { type: GraphQLString, defaultValue: primaryKeyName },
          offset: { type: GraphQLInt, defaultValue: 0 },
          limit: { type: GraphQLInt, defaultValue: DEFAULT_LIMIT }
        },
        resolve: () => 'items'
      },
      item: {
        type: context.schema._typeMap[typeName],
        args: {
          [primaryKeyName]: { type: primaryKeyType }
        },
        resolve: () => ({ title: 'hello' })
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
        args: { new: { type: context.deltas[typeName] } },
        resolve: () => 'create'
      },
      update: {
        type: context.schema._typeMap[typeName],
        args: { [primaryKeyName]: { type: primaryKeyType }, delta: { type: context.deltas[typeName] } },
        resolve: () => 'update'
      },
      delete: {
        type: new GraphQLList(primaryKeyType),
        args: { ids: { type: new GraphQLList(primaryKeyType) } },
        resolve: () => 'delete'
      }
    }
  });
};
