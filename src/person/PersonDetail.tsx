import React from 'react';
import {
  ArrayInput,
  Create,
  Edit,
  required,
  SimpleForm,
  SimpleFormIterator,
  TextInput
} from 'react-admin';

interface PersonDetailFormProps {
  permissions: string;
  create?: boolean;
  edit?: boolean;
  classes?: any;
}
const PersonDetailForm = (props: PersonDetailFormProps) => (
  <SimpleForm {...props} submitOnEnter={false}>
    <TextInput source="id" disabled={true} fullWidth={true} />
    <TextInput
      source="firstName"
      validate={required()}
      resettable={props.create || props.edit}
      disabled={!props.create && !props.edit}
      fullWidth={true}
    />
    <TextInput
      source="lastName"
      validate={required()}
      resettable={props.create || props.edit}
      disabled={!props.create && !props.edit}
      fullWidth={true}
    />
    <TextInput
      source="age"
      type="number"
      resettable={props.create || props.edit}
      disabled={!props.create && !props.edit}
      fullWidth={true}
    />
    <TextInput
      source="favouriteColour"
      resettable={props.create || props.edit}
      disabled={!props.create && !props.edit}
      fullWidth={true}
    />
    <ArrayInput source="hobbies">
      <SimpleFormIterator>
        <TextInput
          lable="Name"
          source="name"
          resettable={props.create || props.edit}
          disabled={!props.create && !props.edit}
          fullWidth={true}
        />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);

export const PersonCreate = (props: { permissions: string }) => (
  <Create {...props}>
    <PersonDetailForm
      permissions={props.permissions}
      create={true}
      {...props}
    />
  </Create>
);

export const PersonEdit = (props: { permissions: string }) => (
  <Edit {...props}>
    <PersonDetailForm permissions={props.permissions} edit={true} {...props} />
  </Edit>
);
