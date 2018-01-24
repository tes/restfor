import React from 'react';
import Chip from 'material-ui/Chip';

export default ({ record }) =>
  record.deadline && Date.parse(record.deadline) < Date.now() ? (
    <Chip backgroundColor="#F44336" labelColor="white">
      Expired
    </Chip>
  ) : null;
