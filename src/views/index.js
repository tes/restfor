export default register => {
  register.grid.property('task', 'deadline', ({ value }) => new Date(value).toLocaleTimeString());
};
