import React from 'react';
import Check from 'material-ui/svg-icons/navigation/check';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

export default register => {
  register.grid.bool(({ value }) => (value ? <Check /> : ''));
  register.grid.enum(({ value }) => <Chip>{value}</Chip>);
  register.grid.date(({ value }) => new Date(value).toLocaleString());
  register.grid.any(({ value }) => value);

  register.editor.bool(({ value, schema, propertyName, onChange }) => (
    <Toggle toggled={value} disabled={schema[propertyName].autoGenerated} onToggle={(_, value) => onChange(value)} />
  ));

  register.editor.date(({ value, schema, propertyName, onChange }) => (
    <DateTimePicker
      value={value ? new Date(value) : null}
      DatePicker={DatePickerDialog}
      TimePicker={TimePickerDialog}
      onChange={value => onChange(value.toISOString())}
      disabled={schema[propertyName].autoGenerated}
    />
  ));

  register.editor.enum(({ value, onChange, schema, propertyName }) => (
    <SelectField value={value} onChange={(_, __, value) => onChange(value)}>
      {schema[propertyName].values.map(value => <MenuItem key={value} value={value} primaryText={value} />)}
    </SelectField>
  ));

  register.editor.number(({ propertyName, value, onChange, schema }) => (
    <TextField
      name={propertyName}
      type="number"
      value={value}
      onChange={(_, value) => onChange(Number(value))}
      disabled={schema[propertyName].autoGenerated}
    />
  ));

  register.editor.string(({ propertyName, value, onChange, schema }) => (
    <TextField
      name={propertyName}
      value={value}
      onChange={(_, value) => onChange(value)}
      disabled={schema[propertyName].autoGenerated}
    />
  ));
};
