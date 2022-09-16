import { createTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './normalize.css';
import './ScanningScreen';
import { SuccessScreen } from './SuccessScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006837',
    },
    secondary: {
      main: '#ddd',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
// if (import.meta.hot) {
//   import.meta.hot.accept();
// }
