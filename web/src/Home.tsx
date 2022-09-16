import React, { useState, useEffect } from 'react';
import logo from './xiphoo_logo.svg';
import './App.css';
import { Button } from '@material-ui/core';
import { isProd } from "./config";

interface AppProps {
  onStartScanning: () => void;
}
const supported = typeof NDEFReader !== 'undefined';

function App({ onStartScanning }: AppProps) {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);
  // Return the App component.
  return (
    <div className="App">
      <div className="container flex">
        <div className="outer-circle flex">
          <div className="inner-circle flex">
            <img src={logo} alt="" className="xiphoo-logo" />
          </div>
        </div>
      </div>
      {!supported && (
        <p>Your platform does not support WebNFC. Please download our app.</p>
      )}
      {supported && (
        <button onClick={onStartScanning}>
          <h1>Scan Tag</h1>
        </button>
      )}
      <Button
        sx={{
          borderRadius: 999,
          mt: 3,
          px: 3,
          py: 0,
          textTransform: 'none',
        }}
        variant="contained"
        size="small"
        color="secondary"
        href="market://details?id=com.xiphoo.app"
      >
        <h1>Download our App</h1>
      </Button>
      <h5>{isProd? '' : 'Development'}</h5>
    </div>
  );
}

export default App;
