import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.PureComponent {
  static propTypes = {
    views: PropTypes.object
  };

  static childContextTypes = {
    views: PropTypes.object
  };

  getChildContext() {
    return { views: this.props.views };
  }

  render() {
    return <div className="absolute">{this.props.children}</div>;
  }
}

export const getViews = (defaultViewFactory, viewFactory) => {
  let views = {
    grid: { properties: {}, types: {}, actions: {} },
    details: { properties: {}, types: {}, actions: {} },
    editor: { properties: {}, types: {}, actions: {} },
    actions: { properties: {}, types: {}, actions: {} }
  };
  defaultViewFactory(register(views));
  viewFactory(register(views));
  return views;
};

const registerType = (views, viewName, typeName) => component => {
  views[viewName].types[typeName] = component;
};

const registerProperty = (views, viewName) => (resourceName, propertyName, component) => {
  views[viewName].properties[resourceName] = views[viewName].properties[resourceName] || {};
  views[viewName].properties[resourceName][propertyName] = component;
};

const registerAction = (views, viewName) => (resourceName, name, callback, options) => {
  views[viewName].actions[resourceName] = views[viewName].actions[resourceName] || [];
  views[viewName].actions[resourceName].push({ name, callback, ...options });
};

const register = views => ({
  grid: {
    bool: registerType(views, 'grid', 'bool'),
    string: registerType(views, 'grid', 'string'),
    number: registerType(views, 'grid', 'number'),
    date: registerType(views, 'grid', 'date'),
    enum: registerType(views, 'grid', 'enum'),
    any: registerType(views, 'grid', 'any'),
    property: registerProperty(views, 'grid'),
    action: registerAction(views, 'grid')
  },
  details: {
    bool: registerType(views, 'details', 'bool'),
    string: registerType(views, 'details', 'string'),
    number: registerType(views, 'details', 'number'),
    date: registerType(views, 'details', 'date'),
    enum: registerType(views, 'details', 'enum'),
    any: registerType(views, 'details', 'any'),
    property: registerProperty(views, 'details'),
    action: registerAction(views, 'details')
  },
  editor: {
    bool: registerType(views, 'editor', 'bool'),
    string: registerType(views, 'editor', 'string'),
    number: registerType(views, 'editor', 'number'),
    date: registerType(views, 'editor', 'date'),
    enum: registerType(views, 'editor', 'enum'),
    any: registerType(views, 'editor', 'any'),
    property: registerProperty(views, 'editor'),
    action: registerAction(views, 'editor')
  },
  actions: {
    bool: registerType(views, 'actions', 'bool'),
    string: registerType(views, 'actions', 'string'),
    number: registerType(views, 'actions', 'number'),
    date: registerType(views, 'actions', 'date'),
    enum: registerType(views, 'actions', 'enum'),
    any: registerType(views, 'actions', 'any')
  }
});

export const getField = view => (views, resourceName, props) => {
  if (!props.schema) {
    const Component = views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName];
    return <Component {...props} />;
  }
  const type = props.schema.fields[props.propertyName].type;
  const Component =
    (views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName]) ||
    views[view].types[type] ||
    views[view].types.any;
  return Component ? <Component {...props} /> : null;
};

export const getActions = view => (views, resourceName) => {
  return (views[view].actions && views[view].actions[resourceName]) || [];
};

export const getActionParamComponent = (views, resourceName, paramName, paramType, props) => {
  const view = 'actions';
  const Component =
    (views[view].properties[resourceName] && views[view].properties[resourceName][paramName]) ||
    views[view].types[paramType.type] ||
    views[view].types.any;
  return Component ? <Component {...props} /> : null;
};

export const getAdditionalProperties = (views, viewName, schema, resourceName) => {
  if (!schema) return [];
  const schemaProperties = Object.keys(schema.fields);
  if (schemaProperties.length === 0) return [];
  const viewProperties = (views[viewName].properties[resourceName] &&
    Object.keys(views[viewName].properties[resourceName])) || [];
  return viewProperties.filter(viewProperty => !schemaProperties.includes(viewProperty));
};
