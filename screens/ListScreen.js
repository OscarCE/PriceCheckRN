import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import EmptyScreen, * as ES from './../components/EmptyScreen';

@inject('barcodeStore')
@observer
export default class ListScreen extends React.Component {
  async componentDidMount() {
    const { barcodeStore, navigation } = this.props;

    if (!barcodeStore.hasBarcodes()) {
      barcodeStore.addBarcode('123');
    }
  }

  render() {
    const { barcodeStore, navigation } = this.props;
    return (
      <View>
        <EmptyScreen />
        <Text>List Screen</Text>
        {
          barcodeStore.barcodes.map((item, index) => <Text key={index}>{item}</Text>)
        }
      </View>
    );
  }
}
