import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from './components/Test'
import TestFunc from './components/TestFunc'
import Layout from './components/Layout/Layout'

import HomePage from './components/Page/HomePage'
import DoctorsPage from './components/Page/DoctorsPage'
import DoctorDetailPage from './components/Page/DoctorDetailPage'
import Medical_RecordsPage from './components/Page/Medical_RecordsPage'
import PatientsPage from './components/Page/PatientsPage'
import PatientsDetailPage from './components/Page/PatientsDetailPage'
import SchedulesPage from './components/Page/SchedulesPage'
import Treatment_Costs from './components/Page/Treatment_Costs'
import UsersPage from './components/Page/UsersPage'

const Home = () => <h2>Home Page</h2>;
const About = () => <h2>About Page</h2>;
const LoginBox = () => <h2>LoginBox Page</h2>;

function LoginBox2(){
  return <h2>LoginBox Page</h2>
}

export default class App extends React.Component {
  constructor(){
    super()
    //物件
    this.state = {
      count : 0,

      obj:{
        userid: 123456,
        date:"2020-01-01",
        Key:"123456789987654321",
      },
      
      arr4: [ 
        {id: 5, name : '1111', date : "2020-01-01"},
        {id: 6, name : '1122', date : "2020-05-01"},
        {id: 7, name : '2211', date : "2020-09-01"},
        {id: 8, name : '2222', date : "2020-12-01"},
       ],

       menu : [
        {path: '/doctors', element: DoctorsPage, name: '治療師列表', disabled : false, groupid: "0"},
        {path: '/doctordetail', element: DoctorDetailPage, name: '治療師詳情', disabled : false, groupid: "0"},
        {path: '/medical_records', element: Medical_RecordsPage, name: '診療紀錄', disabled : false, groupid: "1"},
        {path: '/patients', element: PatientsPage, name: '病患列表', disabled : false, groupid: "1"},
        {path: '/patientsdetail', element: PatientsDetailPage, name: '病患詳情', disabled : false, groupid: "1"},
        {path: '/schedules', element: SchedulesPage, name: '排班表', disabled : false, groupid: "0"},
        {path: '/treatment_costs', element: Treatment_Costs, name: '診療費用', disabled : false, groupid: "1"},
        {path: '/users', element: UsersPage, name: '後台用戶', disabled : false, groupid: "2"},
      ],

      menuclass : [
        {key: '0', label: '醫師相關', icon: 'pi pi-user-edit'},
        {key: '1', label: '病患相關', icon: 'pi pi-users'},
        {key: '2', label: '系統相關', icon: 'pi pi-server'},
      ]
    }

    this.arr1 = [ 
      {id: 1, name : 'xxxx'},
      {id: 2, name : 'xxoo'},
      {id: 3, name : 'ooxx'},
      {id: 4, name : 'oooo'},
     ]
    this.arr2 = [ 
      {id: 5, name : '1111'},
      {id: 6, name : '1122'},
      {id: 7, name : '2211'},
      {id: 8, name : '2222'},
     ]

     this.arr3 = [ 5,6,7,8 ]

  }

  render(){
    return (
      <BrowserRouter>
        <div>

          {/* <Test 
          propArr1={this.arr1} 
          propArr2={this.arr2} 
          LoginBox={LoginBox2}
          LoginBoxobj={<LoginBox2 />}
          {...this.state.obj}
          /> */}
        </div>
        {/*
        <div>
          <TestFunc propArr3={this.arr3} func={this.showlist3}/>
        </div>*/}
      
        <Routes>
          <Route path="/" element={<Layout MenuList={this.state.menu} MenuClass={this.state.menuclass}/>}>
            <Route index element={<HomePage />} />
              {this.state.menu.map((Menu) => {
                  return <Route  
                            path={Menu.path} 
                            element={<Menu.element />}>
                        </Route >
              })} 
            </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}


