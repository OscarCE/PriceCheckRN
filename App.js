import * as React from 'react';
import { Platform, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { Provider as StoreProvider } from 'mobx-react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import stores from './stores';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565c0',
  },
};

export default class App extends React.Component {
  render() {
    return (
      <StoreProvider {...stores}>
        <PaperProvider>
          <SafeAreaView style={styles.safeArea}>
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            <AppNavigator style={styles.navigator} />
          </SafeAreaView>
        </PaperProvider>
      </StoreProvider>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#272C36',
  },
  navigator: {
    // backgroundColor: '#272C36',
  }
});
