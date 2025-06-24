import React, { Component } from 'react';
import { ComboBox } from 'rc-easyui';

export default class SelectItem extends Component {  
  constructor(){
    super()
    this.state = {
      value: null,
      data: [],
      source: [
        { value: 11, text: "Mr. Nice" },
        { value: 12, text: "Narco" },
        { value: 13, text: "Bombasto" },
        { value: 14, text: "Celeritas" },
        { value: 15, text: "Magneta" },
        { value: 16, text: "RubberMan" },
        { value: 17, text: "Dynama" },
        { value: 18, text: "Dr IQ" },
        { value: 19, text: "Magma" },
        { value: 20, text: "Tornado" }
      ]
    }
  }
  handleFilterChange(event) {
    let q = event.filterValue || "";
    let data = this.state.source.filter(item => item.text.indexOf(q) !== -1);
    this.setState({ data: data })
  }
  

  render() {
    return (
      <div>
      <h2>Lazy Filtering</h2>
      <ComboBox
        placeholder="Searching..."
        lazy
        data={this.state.data}
        value={this.state.value}
        onChange={(value) => this.setState({ value: value })}
        onFilterChange={this.handleFilterChange.bind(this)}
      />
      <p>You selected: {this.state.value}</p>
    </div>
    )
  }

}