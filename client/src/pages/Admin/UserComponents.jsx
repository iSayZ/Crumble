/* eslint-disable */
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
} from "react-admin";

// Component to list users
export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="User ID" />
      <TextField source="username" label="Username" />
      <TextField source="email" label="Email" />
    </Datagrid>
  </List>
);

// Component to edit a user
export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" label="Username" />
      <TextInput source="email" label="Email" />
    </SimpleForm>
  </Edit>
);

// Component to display user details
export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="User ID" />
      <TextField source="username" label="Username" />
      <TextField source="email" label="Email" />
    </SimpleShowLayout>
  </Show>
);
