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
