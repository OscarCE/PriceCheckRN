import { observable, computed, action } from 'mobx';
import { AsyncStorage } from 'react-native';

export default class BarcodeStore {
  @observable barcodes = [];
  loaded = false;

  async loadBarcodes() {
    if (this.loaded === true) { return; }

    try {
      let bc = await AsyncStorage.getItem('@BarcodeStorage:barcodes');
      this.barcodes = JSON.parse(bc) || [];
      this.loaded = true;
    } catch (e) {
      this.loaded = false;
      console.log(e);
    }
  }
  async saveBarcodes() {
    try {
      await AsyncStorage.setItem('@BarcodeStorage:barcodes', JSON.stringify(this.barcodes));
    } catch (e) {
      console.log(e);
    }
  }

  @action async addBarcode(barcode) {
    await this.loadBarcodes();

    if (this.barcodes.indexOf(barcode) === -1) {
      this.barcodes.push(barcode);
      this.saveBarcodes();
    }
  }

  @action async deleteBarcode(barcode) {
    await this.loadBarcodes();

    const idx = this.barcodes.indexOf(barcode);
    if (idx >= 0) {
      this.barcodes.splice(idx, 1);
      this.saveBarcodes();
    }
  }

  async hasBarcodes() {
    await this.loadBarcodes();

    return this.barcodes.length > 0;
  }
}
