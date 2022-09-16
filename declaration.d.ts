declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare namespace ZebraScanner {
  type callBack = (code: string) => void;

  export function isAvailable(): Promise<boolean>;
  export function addScanListener(listener: callBack): void;
  export function removeScanListener(listener: callBack): void;
}
declare module 'react-native-zebra-scanner' {
  export = ZebraScanner;
}
