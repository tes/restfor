import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { switchEntity } from '../actionCreators';

class EntityTabs extends React.PureComponent {
  handleTabChange = entity => this.props.switchEntity(entity);

  render() {
    const { entities } = this.props;
    return (
      <Tabs value={this.props.params.entity} onChange={this.handleTabChange}>
        {Object.keys(entities).map(entity => (
          <Tab key={entity.toLowerCase()} label={entity} value={entity.toLowerCase()}>
            <div>
              <h2>{entity}</h2>
              <p>
                Tabs are also controllable if you want to programmatically pass them their values. This allows for more
                functionality in Tabs such as not having any Tab selected or assigning them different values.
              </p>
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }
}

export default connect(({ entities, isFetching }) => ({ entities, isFetching }), { switchEntity })(EntityTabs);
