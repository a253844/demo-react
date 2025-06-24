import React, { Component } from 'react';
import { Outlet } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import Header from '../Header/Header'
import Footer from '../Foot/Footer'
import NavItem from '../Item/NavItem'


export default class Layout extends Component {  
  constructor(){
    super()

    this.state = {
          isSidebarVisible: false,
    };
    

  }

  toggleSidebar = () => {
    this.setState(prevState => ({
        isSidebarVisible: !prevState.isSidebarVisible,
    }));
  };

  render() {    
    const HeaderItems = [
      { label: "首頁", 
        icon: "pi pi-home",
        url: "/"
      }
    ];

    this.props.MenuGroup.forEach((group) => {
      const templist = []
      let count = 1;
      group.menus.forEach((data) => { 
        console.log(data.disabled);
        if(!data.disabled){
          templist.push({ 
            key: data.itemId,
            label: data.name,
            url: data.path,
          })
        } 
      });
      
      HeaderItems.push({
        key: group.groupId,
        label: group.groupName,
        icon: group.groupIcon,
        items: templist
      })
    });


    const HeaderEndItems = (
      <div className="flex align-items-center gap-2">
          <label className="font-bold block mb-2">醫生您好</label>
          <Button icon="pi pi-sign-out" label="登出" className="p-button-text" />
      </div>
    );

    return (
        
        <div className="layout-wrapper">
            {/* 頂部 Header */}
            <Menubar
                model={HeaderItems}
                end={HeaderEndItems}
            />

            {/* <Button
                icon="pi pi-bars"
                className="toggle-sidebar-button p-button-text"
                onClick={() => this.toggleSidebar()}
                visible="false"
            /> */}

            {/* 右側可收折 Menu */}
            <Sidebar
                visible={this.state.isSidebarVisible}
                position="left"
                onHide={() => this.setState({ isSidebarVisible: false })}
            >
                <h3>Menu</h3>
                <NavItem MenuList={this.props.MenuList} MenuClass={this.props.MenuClass}></NavItem>
            </Sidebar>

            {/* 中間主要畫面 */}
            <div className="main-content">
              <Outlet />
            </div>
        </div>
    )
  }

}