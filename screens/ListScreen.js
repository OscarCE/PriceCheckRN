import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { View, StyleSheet, ScrollView } from 'react-native';
import EmptyScreen from '../components/EmptyScreen';
import { observable, action } from 'mobx';
import Async from 'react-promise';
import { barcodeListSearch } from './../api/Search';
import Card from '../components/Cards/Card';
import CardIcon from '../components/Cards/Icon';


@inject('barcodeStore')
@observer
export default class ListScreen extends React.Component {
  @observable resultados = [];
  constructor(props) {
    super(props);
    // initialize barcode store
    this._barcodeStore = this.props.barcodeStore;
    this.addBarcode = this.addBarcode.bind(this);
    this.deleteBarcode = this.deleteBarcode.bind(this);
  }
  async componentDidMount() {
    this._onFocus = this.props.navigation.addListener(
      'didFocus',
      async (payload) => {
        await this._barcodeStore.loadBarcodes();
        // set add and delete functions for this screen
        this._barcodeStore.setAddBarcodeHelper(this.addBarcode);
        this._barcodeStore.setDeleteBarcodeHelper(this.deleteBarcode);

        this.resultados = await barcodeListSearch(this._barcodeStore.barcodes);
      }
    );
  }
  componentWillUnmount() {
    this._onFocus.remove();
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
            this.resultados.length === 0
              ? <EmptyScreen bg="emptyList" />
              : this.resultados.map((pp, index) => {
                return (
                  <Async
                    key={index}
                    promise={pp}
                    then={productCard}
                    catch={ErrorCard}
                    pending={LoadingCard}
                  />
                );
              })
          }
        </View>
      </ScrollView>
    );
  }

  addBarcode() {
    console.log('List add barcode');
  }

  @action async deleteBarcode(bc) {
    await this._barcodeStore.deleteBarcode(bc);

    this.resultados.map(async (item, ind, arr) => {
      const iitem = await item;
      const newArr =arr.slice(0);
      if (iitem.barcode === bc) {
        newArr.splice(ind, 1);
        this.resultados.replace(newArr);
      }
    });
  }
}

const LoadingCard = () => {
  return (
    <CardIcon icon="loading" />
  );
};
const ErrorCard = () => {
  return (
    <CardIcon icon="error" />
  );
};
const productCard = (prod) => {
  return (
    <Card parent="list" content={prod} />
  );
};
