const { directive: { DEFAULT_VALUE } } = require('./consts');

module.exports = directives => {
  const defaultDirective = directives.find(directive => directive.name.value === DEFAULT_VALUE);
  return defaultDirective
    ? defaultDirective.arguments.find(argument => argument.name.value === 'value').value.value
    : null;
};
