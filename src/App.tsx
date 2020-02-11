import * as React from 'react';
import { Admin, Resource } from 'react-admin';

import './App.css';

import authProvider from './authProvider';
import dataProviderFactory from './dataProvider';
import person from './person';

class App extends React.Component<{}, any> {
  public state = { dataProvider: null };

  public componentDidMount() {
    const dataProvider = dataProviderFactory({});
    this.setState({ dataProvider });
  }

  public render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      );
    }

    return (
      <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource key="resource-" name="persons" {...person} />
      </Admin>
    );
  }
}

export default App;
