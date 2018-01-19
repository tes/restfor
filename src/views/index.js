import React from 'react';
import TextField from 'material-ui/TextField';
import Person from 'material-ui/svg-icons/social/person';
import MyCustomIsExpired from './MyCustomIsExpired';

export default register => {
  //register.grid.property('task', 'deadline', ({ value }) => new Date(value).toLocaleTimeString());

  register.grid.property('task', 'isExpired', MyCustomIsExpired);

  register.editor.property('task', 'isExpired', MyCustomIsExpired);

  register.editor.property('task', 'UserId', ({ propertyName, value, onChange }) => (
    <div>
      <Person />{' '}
      <TextField name={propertyName} type="number" value={value} onChange={(_, value) => onChange(Number(value))} />
    </div>
  ));
};
