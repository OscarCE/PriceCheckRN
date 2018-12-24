import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card as PCard, Text, Button } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { inject, observer } from 'mobx-react';

const Card = inject('barcodeStore')(observer(({ content, parent, barcodeStore }) => {
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
    },
    titulo: {
      marginBottom: 12,
      fontWeight: '500',
    },
    image: {
      width: 100,
      height: 100,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 8,
    },
    cardPriceList: {
      fontSize: 16 * 0.75,
    },
    store: {
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 3,
      paddingRight: 3,
      marginBottom: 3,
      overflow: 'scroll',
    },
    special: {
      backgroundColor: '#eee',
      borderRadius: 6,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: '#9acd32',
    },
    storeLogo: {
      borderRadius: 10,
      width: 17,
      height: 17,
      marginRight: 8,
      justifyContent: 'center',
    },
    storeLogoText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    w: {
      backgroundColor: '#008000',
    },
    c: {
      backgroundColor: '#ff0000',
    },
    pricesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'flex-end',
    },
    button: {
      marginTop: 18,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    addButton: {
      backgroundColor: Colors.primary,
    },
    removeButton: {
      backgroundColor: Colors.errorBackground,
    },
  });
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
          <Text
            numberOfLines={2}
            style={estilos.titulo}
          >
            {content.name}
          </Text>
          <Image
            style={estilos.image}
            source={{ uri: content.imageUrl }}
          />
          <Text>
            Content: {content.size}
          </Text>
          <View style={estilos.cardPriceList}>
            {
              content.prices.map((price) => {
                return (
                  <View
                    key={price.id}
                    style={[estilos.store, price.special && estilos.special]}
                  >
                    <View
                      style={estilos.pricesContainer}
                    >
                      <View
                        style={[estilos.storeLogo, estilos[price.store.toLowerCase()]]}
                      >
                        <Text style={estilos.storeLogoText}>
                          {
                            price && price.store.toUpperCase()
                          }
                        </Text>
                      </View>
                      <Text style={estilos.cardPriceList}>
                        {
                          price.price
                            ? price.price.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
                            : 'N/A'
                        }
                      </Text>
                      <Text style={estilos.cardPriceList}>
                        {
                          price.cupString && `${price.cupString}`
                        }
                      </Text>
                    </View>
                  </View>
                );
              })
            }
          </View>
        </PCard.Content>
        <Button
          icon={
            content.added
              ? 'delete'
              : 'add-box'
          }
          mode="contained"
          onPress={
            content.added
              ? barcodeStore.deleteBarcodeHelper.bind(this, content.barcode)
              : barcodeStore.addBarcodeHelper.bind(this, content.barcode)
          }
          style={[
            estilos.button,
            content.added
              ? estilos.removeButton
              : estilos.addButton
          ]}
        >
          {
            content.added
              ? 'Remove'
              : 'Add'
          }
        </Button>
      </PCard>
    </View>
  );
}));

export default Card;
