import { Button } from 'primereact/button';
import React, { Component } from 'react';
import Grid from '../Grid/Grid';
import CalendarItem from '../Item/CalendarItem';
import InputItem from '../Item/InputItem';

export default class PatientsPage extends Component {  
  constructor(){
    super()

  }

  render() {
    return (
        <div>
          <div className="card flex flex-wrap gap-3 p-fluid">
            <InputItem Label={"病患姓名"}></InputItem>
            <CalendarItem Label={"開始時間"}></CalendarItem>
            <CalendarItem Label={"結束時間"}></CalendarItem>
            <div>
              <Button label="查詢" icon="pi pi-search" />
            </div>
          </div>
          <Grid></Grid>
        </div>
    )
  }

}