import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'


const events = [
  { title: 'All Day Event', start: getDate('YEAR-MONTH-01') },
  {
      title: 'Long Event',
      start: getDate('YEAR-MONTH-07'),
      end: getDate('YEAR-MONTH-10'),
  },
  {
      groupId: '999',
      title: 'Repeating Event',
      start: getDate('YEAR-MONTH-09T16:00:00+00:00'),
  },
  {
      groupId: '999',
      title: 'Repeating Event',
      start: getDate('YEAR-MONTH-16T16:00:00+00:00'),
  },
  {
      title: 'Conference',
      start: 'YEAR-MONTH-17',
      end: getDate('YEAR-MONTH-19'),
  },
  {
      title: 'Meeting',
      start: getDate('YEAR-MONTH-18T10:30:00+00:00'),
      end: getDate('YEAR-MONTH-18T12:30:00+00:00'),
  },
  { title: 'Lunch', start: getDate('YEAR-MONTH-18T12:00:00+00:00') },
  { title: 'Birthday Party', start: getDate('YEAR-MONTH-19T07:00:00+00:00') },
  { title: 'Meeting', start: getDate('YEAR-MONTH-18T14:30:00+00:00') },
  { title: 'Happy Hour', start: getDate('YEAR-MONTH-18T17:30:00+00:00') },
  { title: 'Dinner', start: getDate('YEAR-MONTH-18T20:00:00+00:00') },
]

function getDate(dayString) {
  const today = new Date()
  const year = today.getFullYear().toString()
  let month = (today.getMonth() + 1).toString()

  if (month.length === 1) {
      month = '0' + month
  }

  return dayString.replace('YEAR', year).replace('MONTH', month)
}

export default class SchedulesPage extends Component {  
  constructor(){
    super()
    
  }

  render() {
    return (
        <div>
          
          <Form>
            <Row className="mb-3">
              <Form.Group className="mb-3" controlId="formBasicDate">
                <Form.Label>date</Form.Label>
                <Form.Control type="date" placeholder="Enter date" />
                <Form.Text className="text-muted">
                  We'll never share your date with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicTime">
                <Form.Label>time</Form.Label>
                <Form.Control type="time" placeholder="Enter time" />
                <Form.Text className="text-muted">
                  We'll never share your time with anyone else.
                </Form.Text>
              </Form.Group>
            </Row>
          </Form>

          <div className='calendarContainer'>
            <FullCalendar
                plugins={[dayGridPlugin]}
                height='500px'
                weekends={false}
                events={[
                  { title: 'event 1', date: '2019-04-01' },
                  { title: 'event 2', date: '2019-04-02' }
                ]}
            />
        </div>
        </div>
        
    )
  }

}