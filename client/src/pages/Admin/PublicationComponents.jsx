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

// Component for listing publications
export const PublicationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Publication ID" />
      <TextField source="content" label="Contenu" />
      <TextField source="date_publication" label="Publication Date" />
      <TextField source="picture" label="Picture" />
      <TextField source="id_account_fk" label="Account ID" />
    </Datagrid>
  </List>
);

// Component for editing a publication
export const PublicationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="content" label="Content" />
    </SimpleForm>
  </Edit>
);

// Component for displaying the details of a publication
export const PublicationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Publication ID" />
      <TextField source="content" label="Contenu" />
      <TextField source="date_publication" label="Publication Date" />
      <TextField source="picture" label="Picture" />
      <TextField source="id_account_fk" label="Account ID" />
    </SimpleShowLayout>
  </Show>
);
