import * as React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import TabBarIcon from './../components/TabBarIcon';

import ListScreen from './../screens/ListScreen';
import ScanScreen from './../screens/ScanScreen';
import SearchScreen from './../screens/SearchScreen';

const ScanStack = createStackNavigator(
  {
    Scan: ScanScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: 'Scan',
      tabBarColor: '#546e7a',
    }
  }
);
const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: 'Search',
      tabBarColor: '#2962ff',
    }
  }
);
const ListStack = createStackNavigator(
  {
    List: ListScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: 'List',
      tabBarColor: '#1565c0',
    }
  }
);

const matNavigator = createMaterialBottomTabNavigator(
  {
    ScanTab: ScanStack,
    SearchTab: SearchStack,
    ListTab: ListStack,
  },
  {
    initialRouteName: 'SearchTab',
    shifting: true,
    activeColor: '#fff',
    inactiveColor: '#ccc',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'ScanTab':
            iconName = 'barcode-scan';
            break;
          case 'SearchTab':
            iconName = 'feature-search-outline';
            break;
          case 'ListTab':
            iconName = 'view-dashboard'
            break;
        }

        return (<TabBarIcon
          focused={focused}
          name={iconName}
          color={tintColor}
        />);
      }
    })
  }
);

export default createAppContainer(matNavigator);
