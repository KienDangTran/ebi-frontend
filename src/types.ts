import { ReactElement } from 'react';

export type Identifier = string | number;

export interface AppState {
  admin: {
    ui: {
      optimistic: boolean;
      sidebarOpen: boolean;
    };
    resources: {
      [name: string]: {
        data: any;
      };
    };
    references: {
      oneToMany: {
        [relatedTo: string]: { ids: Identifier[]; total: number };
      };
    };
    loading: number;
  };
  i18n: {
    locale: string;
    messages: object;
  };
  theme: string;
}

export interface MenuCategory {
  name: string;
  pathPrefixRegex: RegExp;
  expanded: boolean;
  icon: ReactElement;
}

export type DataProviderType = (
  type: string,
  resource: string,
  params: any
) => Promise<any>;

export interface DataProvider {
  dataProvider: DataProviderType;
  resources: string[];
}
