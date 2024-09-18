/* eslint-disable */
import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from "react-admin";
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

// Custom DataProvider for publications
const publicationDataProvider = {
  ...jsonServerProvider(apiUrl, httpClient),
  getList: (resource, params) => {
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

    return httpClient(url)
      .then(({ headers, json }) => {
        if (!Array.isArray(json)) {
          console.error("Invalid response format:", json);
          throw new Error(
            "Invalid response format: expected an array of items."
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
      })
      .catch((error) => {
        console.error("Error in getList:", error);
        throw error;
      });
  },

  getOne: (resource, params) => {
    if (resource !== "publications") {
      return Promise.reject(new Error("Invalid resource type."));
    }
    const url = `${apiUrl}/${resource}/${params.id}`;

    return httpClient(url)
      .then(({ json }) => {
        if (!json) {
          throw new Error("Invalid response format: expected an object.");
        }

        return {
          data: {
            id: json.id_publication,
            ...json,
          },
        };
      })
      .catch((error) => {
        console.error("Error in getOne:", error);
        throw error;
      });
  },

  update: (resource, params) => {
    if (resource !== "publications") {
      return Promise.reject(new Error("Invalid resource type."));
    }
    const url = `${apiUrl}/${resource}`;

    const data = {
      ...params.data,
      id_publication: params.id,
    };

    return httpClient(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
    })
      .then(({ json }) => {
        if (!json) {
          throw new Error("Invalid response format: expected an object.");
        }

        return { id_publication: params.id, ...json };
      })
      .catch((error) => {
        console.error("Error in update:", error);
        throw error;
      });
  },
};

export default publicationDataProvider;
