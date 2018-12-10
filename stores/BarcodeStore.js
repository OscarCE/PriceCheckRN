import { observable, computed, action } from 'mobx';
import { AsyncStorage } from 'react-native';

export default class BarcodeStore {
  @observable barcodes = [];

  async loadBarcodes() {
    try {
      let bc = await AsyncStorage.getItem('@BarcodeStorage:barcodes');
      this.barcodes = JSON.parse(bc) || [];
    } catch (e) {
      console.log(e);
    }
  }
  async saveBarcodes() {
    try {
      await AsyncStorage.setItem('@BarcodeStorage:barcodes', JSON.stringify(barcodes));
    } catch (e) {
      console.log(e);
    }
  }

  @action addBarcode(barcode) {
    this.barcodes.push(barcode);
  }

  @computed get hasBarcodes() {
    return this.barcodes.length > 0;
  }
}
