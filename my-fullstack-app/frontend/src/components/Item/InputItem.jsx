import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';

export default class InputItem extends Component {  
  constructor(){
    super()
    this.state = {
    }

  }

  render() {
    return (
      <div>
        <InputText placeholder={this.props.Label} />
      </div>
    )
  }

}