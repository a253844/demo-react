import React, { Component } from 'react';
import InputItem from '../Item/InputItem'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import CalendarItem from '../Item/CalendarItem'
import { InputMask } from "primereact/inputmask";

export default class DoctorDetailPage extends Component {  
  constructor(){
    super()

    this.state ={
      value : ''
    }

  }

  setValue = (value) => {
    this.setState ={
      value : value
    }
  }

  render() {
    return (
        <div>
          <div className="card flex flex-wrap gap-3 p-fluid">
            <InputItem Label={"醫師姓名"}></InputItem>
            <div>
              <Button label="查詢" icon="pi pi-search" />
            </div>
          </div>
          <div className="card flex flex-wrap gap-3 p-fluid">
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      員工編號
                  </label>
                  <InputText id="userno" value={this.state.value} onChange={(e) => this.setValue(e.target.value)} />
              </div>
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      姓
                  </label>
                  <InputText id="userno" value={this.state.value} onChange={(e) => this.setValue(e.target.value)} />
              </div>
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      名
                  </label>
                  <InputText id="userno" value={this.state.value} onChange={(e) => this.setValue(e.target.value)} />
              </div>
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      生日
                  </label>
                  <CalendarItem Label={""}></CalendarItem>
              </div>
          </div>
          <div className="card flex flex-wrap gap-3 p-fluid">
              <div className="flex-auto">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      居住地址
                  </label>
                  <InputText id="userno" value={this.state.value} onChange={(e) => this.setValue(e.target.value)} />
              </div>
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      電子郵件
                  </label>
                  <InputText id="userno" value={this.state.value} onChange={(e) => this.setValue(e.target.value)} />
              </div>
              <div className="flex-1">
                  <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      聯絡電話
                  </label>
                  <InputMask value={this.state.value} onChange={(e) => this.setValue(e.target.value)} mask="0900-123-456" placeholder="0900-123-456" />
              </div>
          </div>
        </div>
    )
  }

}