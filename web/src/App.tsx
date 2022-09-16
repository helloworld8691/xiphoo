import React, { useReducer, useState } from 'react';
import Home from './Home';
import { Read } from './NFC';
import ScanningScreen from './ScanningScreen';
import logo from './xiphoo_logo.svg';
import { SuccessScreen } from './SuccessScreen';
import type { Result } from './types';

import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  NavLink,
} from 'react-router-dom';
import {
  IconButton,
  Icon,
  SwipeableDrawer,
  Card,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@material-ui/core';
import { Info } from './Info';
import { IOS } from './IOS';

const initialState = {
  status: 'idle',
};
type StateType = { status: 'scanning' | 'success' | 'idle'; result: Result };
function reducer(state: any, action: any) {
  switch (action.type) {
    case 'start-scanning':
      return { ...state, status: 'scanning' };
    case 'reset':
      return { status: 'idle' };
    case 'success':
      return { ...state, status: 'success', result: action.result };
    default:
      return state;
  }
}

export function App() {
  const history = useHistory();
  const scanTag = async () => {
    dispatch({ type: 'start-scanning' });
    const result = await Read();
    dispatch({ type: 'success', result });
  };
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'start-scanning':
        return { ...state, status: 'scanning' };
      case 'reset':
        history.push('/');
        return { status: 'idle' };
      case 'success':
        history.push('/success');
        return { ...state, status: 'success', result: action.result };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        sx={{ position: 'fixed', top: 0, left: 0, color: 'white' }}
        onClick={() => setOpen(true)}
      >
        <Icon fontSize="large">menu</Icon>
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ bgcolor: '#858585', padding: 4 }}>
          <img src={logo} alt="" height="50px" className="xiphoo-logo" />
        </Box>
        <Box padding={2} onClick={() => setOpen(false)}>
          <List>
            <ListItem
              component={NavLink}
              to="/"
              exact
              sx={{
                backgroundColor: '#eee',
                color: '#000',
                marginY: -2,
                paddingY: 2,
                fontSize: 18,
              }}
              activeStyle={{ backgroundColor: '#C69C6D', color: 'white' }}
            >
              Scanning
            </ListItem>
            <ListItem
              component={NavLink}
              to="/info"
              sx={{
                backgroundColor: '#eee',
                color: '#000',
                paddingY: 2,
                fontSize: 18,
              }}
              activeStyle={{ backgroundColor: '#C69C6D', color: 'white' }}
            >
              Info
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      <Switch>
        <Route path="/success">
          <SuccessScreen
            result={state.result}
            onReset={() => dispatch({ type: 'reset' })}
          />
        </Route>
        <Route path="/info">
          <Info />
        </Route>
        <Route path="/ios">
          <IOS />
        </Route>
        <Route path="/">
          {state.status != 'scanning' ? (
            <Home onStartScanning={scanTag} />
          ) : (
            <ScanningScreen />
          )}
        </Route>
      </Switch>
    </>
  );
}

export default function () {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
