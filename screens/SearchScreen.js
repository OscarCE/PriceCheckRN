import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { busqueda } from './../api/Search';
import { inject, observer } from 'mobx-react';
import ResultsContainer from '../components/Results/Container';
import { observable } from 'mobx';

@inject('barcodeStore')
@observer
export default class SearchScreen extends React.Component {
  @observable resultados;
  @observable error;
  @observable searching = false;
  @observable searchTerm = '';

  constructor(props) {
    super(props);

    // bind functions
    this._barcodeStore = this.props.barcodeStore;
    this.handleSearch = this.handleSearch.bind(this);
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
        // Search = desde scan
        // SearchTab = cambiando tabs
        const routeName = payload.action.routeName;
        const searchTerm = this.props.navigation.getParam('bc', '');
        if (routeName === 'Search') {
          this.setState({
            searchTerm,
          });
          // Invoke the search if we get something from the
          // barcode scan screen.
          this.performSearchAsync(searchTerm);
        }
      }
    );
  }
  componentWillUnmount() {
    this._onFocus.remove();
  }
  render() {
    const estilos = StyleSheet.create({
      screenContainer: {
        display: 'flex',
        padding: 10,
        paddingBottom: 0,
        height: '100%',
      },
      searchView: {
        zIndex: 1,
      },
    });
    const searchTerm = this.searchTerm;
    return (
      <View style={estilos.screenContainer}>
        <View style={estilos.searchView}>
          <Searchbar
            placeholder="Enter a search term or barcode"
            onChangeText={(query) => { this.searchTerm = query }}
            onSubmitEditing={this.handleSearch}
            value={searchTerm}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <ResultsContainer
          error={this.error}
          searching={this.searching}
          results={this.resultados}
        />
      </View>
    );
  }

  async addBarcode(bc) {
    console.log('Search add barcode');

    this._barcodeStore.addBarcode(bc);

    const newResults = this.resultados.map((item) => {
      if (item.barcode === bc) {
        item.added = true;
      }
      return item;
    });

    this.resultados = newResults;
  }

  async deleteBarcode(bc) {
    console.log('Search delete barcode');

    this._barcodeStore.deleteBarcode(bc);

    const newResults = this.resultados.map((item) => {
      if (item.barcode === bc) {
        item.added = false;
      }
      return item;
    });

    this.resultados = newResults;
  }

  async handleSearch() {
    this.performSearchAsync(this.searchTerm);
  }

  async performSearchAsync(term) {
    this.searching = true;
    this.error = undefined;

    try {
      let resultados = await busqueda(term);

      resultados.forEach((item) => {
        item.added = this._barcodeStore.barcodes.find((bc) => item.barcode === bc) && true;
      });

      this.searchTerm = term;
      this.resultados = resultados;
      this.searching = false;
      this.error = undefined;
    }
    catch (err) {
      this.searching = false;
      this.error = 'An error ocurred while searching.';
    }
  }
}
