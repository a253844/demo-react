import React, { Component } from 'react';
import { CheckBox } from 'rc-easyui';

export default class CheckboxItem extends Component {  
  constructor(){
    super()

  }

  render() {
    return (
        <CheckBox checked={this.props.accept}></CheckBox>
    )
  }

}