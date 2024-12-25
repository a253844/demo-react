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
    const menuItems = [
      { label: "Dashboard", icon: "pi pi-home" },
      { label: "Reports", icon: "pi pi-chart-bar" },
      { label: "Settings", icon: "pi pi-cog" },
    ];

    return (
        
        <div className="layout-wrapper">
            {/* 頂部 Header */}
            <Menubar
                model={menuItems}
                end={<Button icon="pi pi-user" label="Profile" className="p-button-text" />}
            />

            {/* 右側可收折 Menu */}
            <Sidebar
                visible={this.state.isSidebarVisible}
                position="left"
                onHide={() => this.setState({ isSidebarVisible: false })}
            >
                <h3>Menu</h3>
                <NavItem MenuList={this.props.MenuList} MenuClass={this.props.MenuClass}></NavItem>
            </Sidebar>
            <Button
                icon="pi pi-bars"
                className="toggle-sidebar-button p-button-text"
                onClick={() => this.toggleSidebar()}
            />

            {/* 中間主要畫面 */}
            <div className="main-content">
              <Outlet />
            </div>
        </div>
    )
  }

}