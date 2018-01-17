import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { switchEntity } from '../actionCreators';
import Grid from './Grid';
import './EntityTabs.css';

class EntityTabs extends React.PureComponent {
  handleTabChange = entity => this.props.switchEntity(entity);

  render() {
    const { entityList, params: { entity: activeTab } } = this.props;
    return (
      <Tabs
        value={activeTab}
        onChange={this.handleTabChange}
        className="absolute column layout"
        contentContainerClassName="relative fitted tab"
        contentContainerStyle={{ height: '100%' }}
      >
        {entityList.map(entity => (
          <Tab key={entity.toLowerCase()} label={entity} value={entity.toLowerCase()}>
            <div className="absolute layout">
              <Grid entityName={entity} isActive={entity.toLowerCase() === activeTab} />
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }
}

export default connect(({ entities, isFetching }) => ({ entityList: Object.keys(entities), isFetching }), {
  switchEntity
})(EntityTabs);
