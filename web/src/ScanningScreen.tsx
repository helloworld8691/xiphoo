import React from 'react';
import './ScanningScreen.scss';
import logo from './logo_white.svg';

export default function ScanningScreen() {
  return (
    <div className="container-white center space-around">
      <div className="circle-con animate">
        <div className="outer"></div>
        <div className="inner"></div>
        <div className="logo-con">
          <img src={logo} width="80%" height="80%" />
        </div>
      </div>
      <div style={{textAlign: "center"}}>
        <h1>Scanning for tags...</h1>
        <p>Please hold your phone near a tag</p>
      </div>
    </div>
  );
}
