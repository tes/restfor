import React from 'react';
import PropTypes from 'prop-types';
import { getType } from '../helpers/types';

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
    editor: { properties: {}, types: {}, actions: {} }
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

const registerAction = (views, viewName) => (resourceName, name, callback) => {
  views[viewName].actions[resourceName] = views[viewName].actions[resourceName] || [];
  views[viewName].actions[resourceName].push({ name, callback });
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
  }
});

export const getField = view => (views, resourceName, props) => {
  if (!props.schema) {
    const Component = views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName];
    return <Component {...props} />;
  }
  const type = getType(props.schema[props.propertyName].type);
  const Component =
    (views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName]) ||
    views[view].types[type] ||
    views[view].types.any;
  return Component ? <Component {...props} /> : null;
};

export const getActions = view => (views, resourceName) => {
  return (views[view].actions && views[view].actions[resourceName]) || [];
};

export const getAdditionalProperties = (views, viewName, schema, resourceName) => {
  if (!schema) return [];
  const schemaProperties = Object.keys(schema);
  if (schemaProperties.length === 0) return [];
  const viewProperties = (views[viewName].properties[resourceName] &&
    Object.keys(views[viewName].properties[resourceName])) || [];
  return viewProperties.filter(viewProperty => !schemaProperties.includes(viewProperty));
};
