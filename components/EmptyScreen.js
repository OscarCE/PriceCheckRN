import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from '@expo/vector-icons/FontAwesome';
import DeadFace from '../assets/svg/DeadFace';
import Desert from './../assets/svg/Desert';

const EmptyScreen = ({ bg, msg }) => {
  const estilos = StyleSheet.create({
    note: {
      fontWeight: 'bold',
      fontSize: 25,
      color: 'lightgray',
      textAlign: 'center',
    }
  });

  const initialSearch = (
    <Icon name="search" size={300} style={{ color: 'lightgray' }} />
  );

  const AnimatedIcon = Animatable.createAnimatableComponent(Icon);
  const searching = (
    <AnimatedIcon
      animation="rotate"
      iterationCount="infinite"
      easing="linear"
      duration={2000}
      name="spinner"
      size={200}
      style={{
        width: 200,
        color: 'lightgray',
      }}
    />
  );

  const error = (
    <>
      <View>
        <DeadFace />
      </View>
      <View>
        <Text style={estilos.note}>{msg}</Text>
      </View>
    </>
  );

  const emptyList = (
    <>
      <View>
        <Desert />
      </View>
      <View >
        <Text style={estilos.note}>Your list is empty. Try adding some items.</Text>
      </View>
    </>
  );

  const noResults = (
    <>
      <View>
        <Desert />
      </View>
      <View >
        <Text style={estilos.note}>No results found.</Text>
      </View>
    </>
  );

  const bgScreen = (bgName) => {
    switch (bgName) {
      case 'initialSearch':
        return initialSearch;
      case 'no-results':
        return noResults;
      case 'emptyList':
        return emptyList;
      case 'searching':
        return searching;
      case 'error':
        return error;
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      {
        bgScreen(bg)
      }
    </View>
  );
};

export default EmptyScreen;
