import axios, { AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import {
  CREATE,
  DELETE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE
} from 'react-admin';

import { DataProvider } from '../types';
import defaultSettings from './default-settings';
import { NotImplementedError } from './errors';
import init from './initializer';

// Set HTTP interceptors.
init();

/**
 * Maps react-admin queries to a JSONAPI REST API
 *
 * @param {string} apiUrl the base URL for the JSONAPI
 * @param {string} userSettings Settings to configure this client.
 * @param additionalDataProvider
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (
  apiUrl: string,
  userSettings?: object,
  additionalDataProvider?: DataProvider
) => async (type: string, resource: string, params: any) => {
  if (
    additionalDataProvider &&
    additionalDataProvider.resources.indexOf(resource) >= 0
  ) {
    return additionalDataProvider.dataProvider(type, resource, params);
  }

  let requestUrl: string = '';
  const requestConfig: AxiosRequestConfig = {
    ...defaultSettings,
    ...userSettings
  };

  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || { field: 'id', order: 'asc' };

      // Create query with pagination params.
      const query = {
        ...flattenObject(params.filter),
        page,
        size: perPage,
        sort: `${field},${order || 'asc'}`
      };

      requestUrl = `${apiUrl}/${resource}?${stringify(query)}`;
      break;
    }

    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || { field: 'id', order: 'asc' };

      // Create query with pagination params.
      const query: object = {
        [params.target]: params.id,
        ...flattenObject(params.filter),
        page,
        size: perPage,
        sort: `${field},${order || 'asc'}`
      };

      requestUrl = `${apiUrl}/${resource}?${stringify(query)}`;
      break;
    }

    case GET_MANY: {
      requestUrl = `${apiUrl}/${resource}?ids=${params.ids.toString()}`;
      break;
    }

    case GET_ONE: {
      requestUrl = `${apiUrl}/${resource}/${params.id}`;
      break;
    }

    case CREATE: {
      requestUrl = `${apiUrl}/${resource}`;
      requestConfig.method = 'POST';
      requestConfig.data = JSON.stringify({ ...params.data });
      break;
    }

    case UPDATE: {
      requestUrl = `${apiUrl}/${resource}/${params.id}`;
      requestConfig.method = 'PUT';
      requestConfig.data = JSON.stringify({ ...params.data });
      break;
    }

    case DELETE: {
      requestUrl = `${apiUrl}/${resource}/${params.id}`;
      requestConfig.method = 'DELETE';
      break;
    }

    default: {
      throw new NotImplementedError(
        `Unsupported Data Provider request type ${type}`
      );
    }
  }

  requestConfig.url = requestUrl;

  const response = await axios(requestConfig);
  switch (type) {
    case GET_LIST:
    case GET_MANY:
    case GET_MANY_REFERENCE: {
      const result: {
        data: any;
        total: number;
      } = {
        data: response.data._embedded
          ? Object.entries(response.data._embedded)[0][1]
          : [],
        total: response.data.page.totalElements
      };
      result.data.map((entity: any, idx: number) => {
        if (!entity.id) {
          entity.id = idx + 1;
        }
        return entity;
      });
      return result;
    }
    case GET_ONE:
    case CREATE:
    case UPDATE: {
      return { data: response.data };
    }
    case DELETE: {
      return {
        data: { id: params.id }
      };
    }
    default:
      throw new NotImplementedError(
        `Unsupported Data Provider request type ${type}`
      );
  }
};

const flattenObject = (value: any, path: string[] = []): object => {
  if (isValidObject(value)) {
    return Object.assign(
      {},
      ...Object.keys(value).map(key =>
        flattenObject(value[key], path.concat([key]))
      )
    );
  } else if (Array.isArray(value)) {
    return { [path.join('.')]: value.toString() };
  } else {
    return path.length ? { [path.join('.')]: value } : value;
  }
};

const isValidObject = (value: any) => {
  if (!value) {
    return false;
  }

  const isArray = Array.isArray(value);
  const isBuffer = typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
  const isObject = Object.prototype.toString.call(value) === '[object Object]';
  const hasKeys = !!Object.keys(value).length;

  return !isArray && !isBuffer && isObject && hasKeys;
};
