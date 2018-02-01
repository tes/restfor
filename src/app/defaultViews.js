import React from 'react';
import Chip from 'material-ui/Chip';
import Switch from 'material-ui/Switch';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { DateTimePicker } from 'material-ui-pickers';
import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import ArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Check from 'material-ui-icons/Check';

export default register => {
  register.grid.bool(({ value }) => (value ? <Check /> : ''));
  register.grid.enum(({ value }) => <Chip label={value} />);
  register.grid.date(({ value }) => new Date(value).toLocaleString());
  register.grid.any(({ value }) => value);

  register.details.bool(({ value }) => (value ? <Check /> : ''));
  register.details.enum(({ value }) => <Chip label={value} />);
  register.details.date(({ value }) => new Date(value).toLocaleString());
  register.details.any(({ value }) => value || null);

  register.actions.bool(({ value, propertyName, onChange }) => (
    <Switch checked={value} onChange={evt => onChange(evt.target.checked)} />
  ));
  register.actions.date(({ value, propertyName, onChange }) => (
    <DateTimePicker
      value={value ? new Date(value) : null}
      onChange={value => onChange(value.toISOString())}
      leftArrowIcon={<ArrowLeft />}
      rightArrowIcon={<ArrowRight />}
    />
  ));
  register.actions.enum(({ value, onChange, propertyName, paramType }) => (
    <Select value={value} onChange={evt => onChange(evt.target.value)}>
      {paramType.values.map(v => (
        <MenuItem key={v} value={v}>
          {v}
        </MenuItem>
      ))}
    </Select>
  ));
  register.actions.number(({ propertyName, value, onChange }) => (
    <TextField name={propertyName} type="number" value={value} onChange={evt => onChange(Number(evt.target.value))} />
  ));
  register.actions.string(({ propertyName, value, onChange }) => (
    <TextField name={propertyName} value={value} onChange={evt => onChange(evt.target.value)} />
  ));
  register.actions.any(({ value }) => value || null);

  register.editor.bool(({ value, schema, propertyName, onChange }) => (
    <Switch
      checked={value}
      disabled={schema.fields[propertyName].readOnly}
      onChange={evt => onChange(evt.target.checked)}
    />
  ));
  register.editor.date(({ value, schema, propertyName, onChange }) => (
    <DateTimePicker
      value={value ? new Date(value) : null}
      onChange={value => onChange(value.toISOString())}
      disabled={schema.fields[propertyName].readOnly}
      leftArrowIcon={<ArrowLeft />}
      rightArrowIcon={<ArrowRight />}
    />
  ));
  register.editor.enum(({ value, onChange, schema, propertyName }) => (
    <Select value={value} onChange={evt => onChange(evt.target.value)}>
      {schema.fields[propertyName].values.map(v => (
        <MenuItem key={v} value={v}>
          {v}
        </MenuItem>
      ))}
    </Select>
  ));
  register.editor.number(({ propertyName, value, onChange, schema }) => (
    <TextField
      name={propertyName}
      type="number"
      value={value}
      onChange={evt => onChange(Number(evt.target.value))}
      disabled={schema.fields[propertyName].readOnly}
    />
  ));
  register.editor.string(({ propertyName, value, onChange, schema }) => (
    <TextField
      name={propertyName}
      value={value}
      onChange={evt => onChange(evt.target.value)}
      disabled={schema.fields[propertyName].readOnly}
    />
  ));
  register.editor.any(({ value }) => value || null);
};
