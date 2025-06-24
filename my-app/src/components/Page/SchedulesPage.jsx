import React, { useState } from 'react';
import CalendarItem from '../Item/CalendarItem'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin  from '@fullcalendar/timegrid'
import { Button } from 'primereact/button';

export default function SchedulesPage() {  

  const [events, setevents] = useState([]);

  const AddEvents = () => {

    setevents(() => [
      ...events,
      { title: 'event 2', start: '2025-01-02 09:00:00', end: '2025-01-02 18:00:00' },
    ])
  };

    return (
        <div>
          
          <div className="card flex flex-wrap gap-3 p-fluid">
              <div className="flex-1">
                  <CalendarItem Label={"開始時間"}></CalendarItem>
              </div>
              <div className="flex-1">
                  <CalendarItem Label={"結束時間"}></CalendarItem>
              </div>
              <div className="flex-1">
                  <div className="card flex flex-wrap gap-3 p-fluid">
                      <div className="flex-1">
                          <Button label="添加" icon="pi pi-search" onClick={AddEvents} /> 
                      </div>  
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                  </div>  
                   
              </div>
              <div className="flex-1"></div>
          </div>

          <div className='calendarContainer'>
            <FullCalendar
                plugins={[timeGridPlugin]}
                height='800px'
                initialView= 'timeGridWeek'
                locale='zh-tw'
                weekends={true}
                allDaySlot={false}
                headerToolbar= {{
                  left: 'prev,next',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay' // user can switch between the two
                }}
                slotMinTime="09:00:00"
                slotMaxTime="23:00:00"
                events={events}
            />
        </div>
        </div>
        
    )
  }

