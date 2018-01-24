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
    return <div>{this.props.children}</div>;
  }
}

export const getViews = (defaultViewFactory, viewFactory) => {
  let views = { grid: { properties: {}, types: {} }, editor: { properties: {}, types: {} } };
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

const register = views => ({
  grid: {
    bool: registerType(views, 'grid', 'bool'),
    string: registerType(views, 'grid', 'string'),
    number: registerType(views, 'grid', 'number'),
    date: registerType(views, 'grid', 'date'),
    enum: registerType(views, 'grid', 'enum'),
    any: registerType(views, 'grid', 'any'),
    property: registerProperty(views, 'grid')
  },
  editor: {
    bool: registerType(views, 'editor', 'bool'),
    string: registerType(views, 'editor', 'string'),
    number: registerType(views, 'editor', 'number'),
    date: registerType(views, 'editor', 'date'),
    enum: registerType(views, 'editor', 'enum'),
    any: registerType(views, 'editor', 'any'),
    property: registerProperty(views, 'editor')
  }
});

export const getComponent = view => (views, resourceName, props) => {
  if (!props.schema) {
    const Component = views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName];
    return <Component {...props} />;
  }
  const type = getType(props.schema[props.propertyName].type);
  const Component =
    (views[view].properties[resourceName] && views[view].properties[resourceName][props.propertyName]) ||
    views[view].types[type] ||
    views[view].types.any;
  return <Component {...props} />;
};

export const getAdditionalProperties = (views, viewName, schema, resourceName) => {
  if (!schema) return [];
  const schemaProperties = Object.keys(schema);
  if (schemaProperties.length === 0) return [];
  const viewProperties =
    (views[viewName].properties[resourceName] && Object.keys(views[viewName].properties[resourceName])) || [];
  return viewProperties.filter(viewProperty => !schemaProperties.includes(viewProperty));
};