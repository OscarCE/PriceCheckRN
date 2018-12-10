import * as React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Searchbar, Title, Text } from 'react-native-paper';
import { busqueda } from './../api/Search';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      searchTerm: 'tabasco',
      searchResults: undefined,
      searching: false,
      error: undefined,
    }
  }
  render() {
    const estilos = StyleSheet.create({
      searchView: {
        zIndex: 1,
      },
      container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 16,
      },
      scrollView: {
        marginBottom: 38,
      },
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
      t: {},
    });
    const searchTerm = this.state.searchTerm;
    return (
      <View style={{ padding: 10 }}>
        <View style={estilos.searchView}>
          <Searchbar
            placeholder="Enter a search term or barcode"
            onChangeText={(query) => { this.setState({ searchTerm: query }) }}
            onSubmitEditing={this.handleSearch}
            value={searchTerm}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <ScrollView style={estilos.scrollView}>
          <View style={estilos.container}>
            {
              this.state.searchResults && this.state.searchResults.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={estilos.cardContainer}
                  >
                    <Card elevation={1}
                      key={index}
                      style={estilos.card}
                    >
                      <Card.Content>
                        <Text
                          numberOfLines={2}
                          style={estilos.titulo}
                        >
                          {item.name}
                        </Text>
                        <Image
                          style={estilos.image}
                          source={{ uri: item.imageUrl }}
                        />
                        <Text>
                          Content: {item.size}
                        </Text>
                        <View style={estilos.cardPriceList}>
                          {
                            item.prices.map((price) => {
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
                                    <Text style={estilos.cardPriceList} className="price">
                                      {
                                        price.price
                                          ? price.price.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
                                          : 'N/A'
                                      }
                                    </Text>
                                    <Text className="cupstring">
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
                      </Card.Content>
                    </Card>
                  </View>
                );
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }

  async handleSearch() {
    const term = this.state.searchTerm;

    this.performSearchAsync(term);
  }

  async performSearchAsync(term) {
    this.setState({
      searching: true,
      error: undefined,
    });

    try {
      let resultados = await busqueda(term);
      console.log(resultados);

      // Check items already added to our list.
      // const bcs = (await localForage.getItem('barcodes')) || [];
      // resultados.forEach((item) => {
      //   item.added = bcs.find((bc) => item.barcode === bc) && true;
      // });

      this.setState({
        searchTerm: term,
        searchResults: resultados,
        searching: false,
        error: undefined,
      });

    } catch (err) {
      this.setState({
        searching: false,
        error: 'An error ocurred while searching.',
      });
    }
  }
}
