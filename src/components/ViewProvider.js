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

export const getViews = viewFactory => {
  let views = {};
  viewFactory(
    register({
      get: () => views,
      set: nextViews => (views = nextViews)
    })
  );
  return views;
};

const registerType = (views, viewName, typeName) => component => {
  const view = views.get()[viewName] || {};
  const types = view.types || {};
  views.set({
    ...views.get(),
    [viewName]: { ...view, types: { ...types, [typeName]: component } }
  });
};

const registerProperty = (views, viewName) => (resourceName, propertyName, component) => {
  const view = views.get()[viewName] || {};
  const properties = view.properties;
  views.set({
    ...views.get(),
    [viewName]: {
      ...view,
      properties: { ...properties, [propertyName]: component }
    }
  });
};

const register = views => ({
  grid: {
    boolean: registerType(views, 'grid', 'boolean'),
    string: registerType(views, 'grid', 'string'),
    number: registerType(views, 'grid', 'number'),
    date: registerType(views, 'grid', 'date'),
    enum: registerType(views, 'grid', 'enum'),
    property: registerProperty(views, 'grid')
  },
  editor: {
    boolean: registerType(views, 'editor', 'boolean'),
    string: registerType(views, 'editor', 'string'),
    number: registerType(views, 'editor', 'number'),
    date: registerType(views, 'editor', 'date'),
    enum: registerType(views, 'editor', 'enum'),
    property: registerProperty(views, 'editor')
  }
});
