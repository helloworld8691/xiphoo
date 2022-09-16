import { Button } from '@material-ui/core';
import React from 'react';
import logo from './xiphoo_logo.svg';

export function IOS() {
  return (
    <div className="App">
      <div className="container flex">
        <div className="outer-circle flex">
          <div className="inner-circle flex">
            <img src={logo} alt="" className="xiphoo-logo" />
          </div>
        </div>
      </div>
      <Button
        sx={{
          borderRadius: 999,
          mt: 3,
          px: 3,
          py: 0,
          background: '#C69C6D',
          textTransform: 'none',
        }}
        variant="contained"
        size="small"
        color="inherit"
        href="https://apps.apple.com/app/id1564442513?mt=8"
      >
        <h1>Download our App</h1>
      </Button>
    </div>
  );
}
