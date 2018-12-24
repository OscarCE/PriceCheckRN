import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as PCard } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from '@expo/vector-icons/FontAwesome';
import DeadFace from '../../assets/svg/DeadFace';

class CardIcon extends React.Component {
  render() {
    const estilos = StyleSheet.create({
      cardContainer: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '50%',
        paddingLeft: 8,
        paddingRight: 8,
        marginBottom: 16,
      },
      card: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      cardContent: {
        flex: 1,
        alignSelf: 'center',
      },
    });
    const AnimatedIcon = Animatable.createAnimatableComponent(Icon);
    const loading = (
      <AnimatedIcon
        animation="rotate"
        iterationCount="infinite"
        easing="linear"
        duration={2000}
        name="spinner"
        size={50}
        style={{
          width: 50,
          color: 'lightgray',
        }}
      />
    );

    return (
      <View
        style={estilos.cardContainer}
      >
        <PCard
          style={estilos.card}
        >
          <PCard.Content
            style={estilos.cardContent}
          >
            {this.props.icon === 'loading' && loading}
            {this.props.icon === 'error' && <DeadFace height={100} width={100} />}
          </PCard.Content>
        </PCard>
      </View>
    );

  }
}

export default CardIcon;
