import React, { Component } from 'react';
import Grid from '../Grid/Grid'
import CalendarItem from '../Item/CalendarItem'
import InputItem from '../Item/InputItem'
import { Button } from 'primereact/button';

export default class DoctorsPage extends Component {  
  constructor(){
    super()


  }

  render() {
    return (
        <div>
          <div className="card flex flex-wrap gap-3 p-fluid">
            <InputItem Label={"醫師姓名"}></InputItem>
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