import React from 'react';
import TextField from 'material-ui/TextField';
import Person from 'material-ui/svg-icons/social/person';
import Chip from 'material-ui/Chip';

export default register => {
  //register.grid.property('task', 'deadline', ({ value }) => new Date(value).toLocaleTimeString());

  register.grid.property(
    'task',
    'isExpired',
    ({ record }) =>
      record.deadline && Date.parse(record.deadline) < Date.now() ? (
        <Chip backgroundColor="#F44336" labelColor="white">
          Expired
        </Chip>
      ) : null
  );

  register.editor.property('task', 'UserId', ({ propertyName, value, onChange }) => (
    <div>
      <Person />{' '}
      <TextField name={propertyName} type="number" value={value} onChange={(_, value) => onChange(Number(value))} />
    </div>
  ));
};
