import Bugsnag from "@bugsnag/react-native";
Bugsnag.start();

/**
 * @format
 */
process.browser = false
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
