import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class ScanScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    renderCamera: false,
  }
  constructor() {
    super();
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });

    // Enable the camera when this screens is focused.
    this._onFocus = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({
          renderCamera: true,
        });
      }
    );

    // Disable camera when the screen is out of focus.
    this._onBlur = this.props.navigation.addListener(
      'didBlur',
      payload => {
        this.setState({
          renderCamera: false,
        });
      }
    );
  }

  async componentWillUnmount() {
    this._onFocus.remove();
    this._onBlur.remove();
  }
  render() {
    const { hasCameraPermission, renderCamera } = this.state;
    const estilos = StyleSheet.create({
      fullScreen: {
        width: '100%',
        height: '100%',
      }
    });
    if (hasCameraPermission === null) {
      return <Text>Requesting camera access...</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Camera access denied.</Text>;
    }
    if (renderCamera === true) {
      return (
        <View>
          <BarCodeScanner
            onBarCodeRead={this.handleBarCodeScanned}
            style={estilos.fullScreen}
          />
        </View>
      );
    }

    return null;
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.props.navigation.navigate('Search', { bc: data });
  }
}
