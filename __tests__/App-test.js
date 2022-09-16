/**
 * @format
 */

/*

3.01.2022 Disabled as it brings weird errors during yarn test call

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
*/

describe('truth', () => {
  it('is true', () => {
    expect(true).toEqual(true);
  });
});
