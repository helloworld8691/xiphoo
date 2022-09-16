import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { Product } from '../redux/productRegistration';
import { SuccessObject } from "../lib/SuccessObject";

export type MainParamList = {
  Home: undefined;
  Login: undefined;
  Settings: undefined;
  Impressum: undefined;
  ProductRegistration: undefined;
  ProductResult: undefined;
  HelpInfo: undefined;
  ScanFailed: undefined;
  BarcodeFailed: undefined;
  BarcodeScanner: undefined;
};

export type MainStackParamList<T extends keyof MainParamList> = {
  navigation: StackNavigationProp<MainParamList, T>;
  route: RouteProp<MainParamList, T>;
};
