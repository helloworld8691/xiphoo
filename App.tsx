import React from 'react';
import Router from './Router';
import {Provider} from 'react-redux';

import {loadSettings } from './src/redux/settings'

import './src/redux/auth/thunk';
import {configureStore} from './src/redux/store';
import { signOut } from './src/redux/auth/thunk';

const store = configureStore();
//@ts-ignore
store.dispatch(loadSettings())
//@ts-ignore
store.dispatch(signOut())

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
