import React, { Component } from 'react';
import GridItem from '../Item/GridItem'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export default class Grid extends Component {  
  constructor(){
    super()

    this.state ={
      DataArr: [ 
        {id: 5, firstname: "周", lastname: "OO", username : '1111'},
        {id: 6, firstname : '吳', lastname : "OO", username : '1112'},
        {id: 7, firstname : '許', lastname : "OO", username : '1113'},
        {id: 8, firstname : '林', lastname : "OO", username : '1114'},
        {id: 5, firstname: "周", lastname: "OO", username : '1111'},
        {id: 6, firstname : '吳', lastname : "OO", username : '1112'},
        {id: 7, firstname : '許', lastname : "OO", username : '1113'},
        {id: 8, firstname : '林', lastname : "OO", username : '1114'},
        {id: 5, firstname: "周", lastname: "OO", username : '1111'},
        {id: 6, firstname : '吳', lastname : "OO", username : '1112'},
        {id: 7, firstname : '許', lastname : "OO", username : '1113'},
        {id: 8, firstname : '林', lastname : "OO", username : '1114'},
        {id: 5, firstname: "周", lastname: "OO", username : '1111'},
        {id: 6, firstname : '吳', lastname : "OO", username : '1112'},
        {id: 7, firstname : '許', lastname : "OO", username : '1113'},
        {id: 8, firstname : '林', lastname : "OO", username : '1114'},
       ],

      ColName : [
        {name: "姓氏"},
        {name: "名稱"},
        {name: "用戶名稱"},
      ],

      RowCount :{
        current: 1,
        total: 16,
      },
        
      
    }

    

  }

  render() {
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    return (
      <div className="card">
            <DataTable value={this.state.DataArr} paginator rows={10} rowsPerPageOptions={[10, 20, 30, 40]} tableStyle={{ minWidth: '50rem' }}
             paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column field="id" header="id" style={{ width: '25%' }}></Column>
                <Column field="firstname" header="firstname" style={{ width: '25%' }}></Column>
                <Column field="lastname" header="lastname" style={{ width: '25%' }}></Column>
                <Column field="username" header="username" style={{ width: '25%' }}></Column>
            </DataTable>
      </div>
    )
  }

}