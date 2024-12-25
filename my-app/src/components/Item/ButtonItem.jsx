import React, { Component } from 'react';
import {  LinkButton } from 'rc-easyui';

export default class ButtonItem extends Component {  
  constructor(){
    super()

  }

  render() {
    return (
      <LinkButton className="c8" style={{width:'120px'}}>{this.props.label}</LinkButton>
    )
  }

}