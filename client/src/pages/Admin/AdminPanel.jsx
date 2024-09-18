/* eslint-disable */
import * as React from "react";
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
  fetchUtils,
} from "react-admin";
import Cookies from "js-cookie";

// URL de l'API
const apiUrl = "http://localhost:3310/api";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const authToken = Cookies.get("authToken");

  options.headers.set("Authorization", `Bearer ${authToken}`);

  return fetchUtils.fetchJson(url, options);
};

// DataProvider combined
const combinedDataProvider = (type, resource, params) => {
  if (resource === "publications") {
    // DataProvider for publications
    switch (type) {
      case "GET_LIST":
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
          _start: (page - 1) * perPage,
          _limit: perPage,
          _sort: field,
          _order: order,
          ...params.filter,
        };
        const url = `${apiUrl}/${resource}?${new URLSearchParams(query)}`;

        return httpClient(url).then(({ headers, json }) => {
          if (!Array.isArray(json)) {
            console.error("Invalid response format:", json);
            return Promise.reject(
              new Error("Invalid response format: expected an array of items.")
            );
          }

          const mappedData = json.map((item) => ({
            id: item.id_publication,
            ...item,
          }));

          const total = parseInt(headers.get("X-Total-Count"), 10);
          return {
            data: mappedData,
            total: total || mappedData.length,
          };
        });

      case "GET_ONE":
        const getOneUrl = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(getOneUrl).then(({ json }) => ({
          data: {
            id: json.id_publication,
            ...json,
          },
        }));

      case "UPDATE":
        const updateUrl = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(updateUrl, {
          method: "PUT",
          body: JSON.stringify(params.data),
          headers: new Headers({ "Content-Type": "application/json" }),
        }).then(({ json }) => ({
          data: {
            id: json.id_publication,
            ...json,
          },
        }));

      default:
        return Promise.reject(new Error(`Unknown method ${type}`));
    }
  } else if (resource === "users") {
    // DataProvider for users
    switch (type) {
      case "GET_LIST":
        const { page: userPage, perPage: userPerPage } = params.pagination;
        const { field: userField, order: userOrder } = params.sort;
        const userQuery = {
          _start: (userPage - 1) * userPerPage,
          _limit: userPerPage,
          _sort: userField,
          _order: userOrder,
          ...params.filter,
        };
        const userUrl = `${apiUrl}/${resource}?${new URLSearchParams(userQuery)}`;
        return httpClient(userUrl).then(({ headers, json }) => {
          if (!Array.isArray(json)) {
            console.error("Invalid response format for users:", json);
            return Promise.reject(
              new Error("Invalid response format: expected an array of users.")
            );
          }

          const mappedUserData = json.map((user) => ({
            id: user.id_user,
            ...user,
          }));

          const total = parseInt(headers.get("X-Total-Count"), 10);
          return {
            data: mappedUserData,
            total: total || mappedUserData.length,
          };
        });

      case "GET_ONE":
        const userGetOneUrl = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(userGetOneUrl).then(({ json }) => ({
          data: {
            id: json.id_user,
            ...json,
          },
        }));

      default:
        return Promise.reject(new Error(`Unknown method ${type}`));
    }
  }
  return Promise.reject(new Error(`Unknown resource: ${resource}`));
};

// Component for publications
const PublicationList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID Publication" />
      <TextField source="content" label="Contenu" />
      <TextField source="date_publication" label="Date de publication" />
      <TextField source="picture" label="Image" />
      <TextField source="id_account_fk" label="ID Auteur" />
    </Datagrid>
  </List>
);

const PublicationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="content" label="Contenu" />
    </SimpleForm>
  </Edit>
);

const PublicationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID Publication" />
      <TextField source="content" label="Contenu" />
      <TextField source="date_publication" label="Date de publication" />
      <TextField source="picture" label="Image" />
      <TextField source="id_account_fk" label="ID Auteur" />
    </SimpleShowLayout>
  </Show>
);

// Component for users
const UserList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id_account" label="ID" />
      <TextField source="firstname" label="Prénom" />
      <TextField source="lastname" label="Nom" />
      <TextField source="email" label="Email" />
      <TextField source="sex" label="Sexe" />
      <TextField source="country" label="Pays" />
      <TextField source="date_creation" label="Date d'inscription" />
      <TextField source="avatar" label="Avatar" />
      <TextField source="coverage" label="Couverture" />
    </Datagrid>
  </List>
);

const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="firstname" label="Prénom" />
      <TextInput source="lastname" label="Nom" />
      <TextInput source="email" label="Email" />
      {/* Ajoutez d'autres champs nécessaires pour l'édition des utilisateurs */}
    </SimpleForm>
  </Edit>
);

const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="firstname" label="Prénom" />
      <TextField source="lastname" label="Nom" />
      <TextField source="email" label="Email" />
      <TextField source="sex" label="Sexe" />
      <TextField source="country" label="Pays" />
      <TextField source="avatar" label="Avatar" />
      <TextField source="coverage" label="Couverture" />
    </SimpleShowLayout>
  </Show>
);

// Main component AdminPanel
const AdminPanel = () => (
  <Admin dataProvider={combinedDataProvider} basename="/admin">
    <Resource
      name="publications"
      list={PublicationList}
      edit={PublicationEdit}
      show={PublicationShow}
    />
    <Resource name="users" list={UserList} edit={UserEdit} show={UserShow} />
  </Admin>
);

export default AdminPanel;
