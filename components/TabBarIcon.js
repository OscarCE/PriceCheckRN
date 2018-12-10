import * as React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <MaterialCommunityIcons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.color}
      />
    );
  }
}
