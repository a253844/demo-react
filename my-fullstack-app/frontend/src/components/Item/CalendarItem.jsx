import React, { Component } from 'react';
import { Calendar } from 'primereact/calendar';

export default class CalendarItem extends Component {  
  constructor(){
    super()
    this.state = {
        datetime24h: null,
    };

  }

  setDateTime24h = (value) =>{
    this.setState({
        datetime24h : value
    })
  }

  render() {
    return (
        <div className="flex-2">
            <Calendar 
                id="calendar-24h" 
                value={this.state.datetime24h} 
                onChange={(e) => this.setDateTime24h(e.value)} 
                placeholder={this.props.Label}
                showTime 
                hourFormat="24" 
                showIcon/>
        </div>
    )
  }

}