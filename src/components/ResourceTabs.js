import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { switchResource } from '../actionCreators';
import Grid from './Grid';
import './ResourceTabs.css';

class ResourceTabs extends React.PureComponent {
  handleTabChange = name => this.props.switchResource(name);

  render() {
    const { schemaList, params: { resource: activeTab } } = this.props;
    return (
      <Tabs
        value={activeTab}
        onChange={this.handleTabChange}
        className="absolute column layout"
        contentContainerClassName="relative fitted tab"
        contentContainerStyle={{ height: '100%' }}
      >
        {schemaList.map(resourceName => (
          <Tab key={resourceName.toLowerCase()} label={resourceName} value={resourceName.toLowerCase()}>
            <div className="absolute layout">
              <Grid resourceName={resourceName} isActive={resourceName.toLowerCase() === activeTab} />
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }
}

export default connect(({ schemas, isFetching }) => ({ schemaList: Object.keys(schemas), isFetching }), {
  switchResource
})(ResourceTabs);
