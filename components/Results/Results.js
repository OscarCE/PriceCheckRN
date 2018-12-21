import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Card from './../Card.js';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const estilos = StyleSheet.create({
      container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 16,
      },
    });

    return (
      <ScrollView>
        <View style={estilos.container}>
          {
            this.props.results && this.props.results.map((result, index) => {
              return (
                <Card key={index} parent="search" content={result} />
              );
            })
          }
        </View>
      </ScrollView>
    );
  };
}
