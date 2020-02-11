import React from 'react';
import {
  Datagrid,
  DeleteButton,
  EditButton,
  Filter,
  List,
  SearchInput,
  TextField
} from 'react-admin';

const PersonFilter = (props: any) => (
  <Filter {...props}>
    <SearchInput source="firstName" alwaysOn={true} label="First Name" />
    <SearchInput source="lastName" label="Last Name" />
  </Filter>
);

const PersonList = (props: { permissions: string }) => (
  <List
    {...props}
    filters={<PersonFilter />}
    sort={{ field: 'id', order: 'ASC' }}
    bulkActions={false}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="age" />
      <TextField source="favouriteColour" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default PersonList;
