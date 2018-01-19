import React from 'react';

export default register => {
  register.grid.boolean(({ value }) => <div />);
  register.grid.date(({ value }) => <div />);
  register.grid.property('task', 'deadline', ({ value }) => <div />);

  register.editor.boolean(({ value }) => <div />);
  register.editor.date(({ value }) => <div />);
  register.editor.property('user', 'createdAt', ({ value }) => <div />);
};
