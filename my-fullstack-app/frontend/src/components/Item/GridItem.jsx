import React, { Component } from 'react';

export default class GridItem extends Component {  
  constructor(){
    super()

  }

  render() {
    return (
        <tr>
          {Object.entries(this.props.RowData).map((key) =>{
            return <td >{key[1]}</td>
          })}  
        </tr>
    )
  }

}