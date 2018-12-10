import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

const switchNavigator = createSwitchNavigator(
  {
    Main: MainTabNavigator,
  }
);

export default createAppContainer(switchNavigator);
