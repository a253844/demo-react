import React, { Component } from 'react';
import { Button } from "primereact/button";
import { PanelMenu } from 'primereact/panelmenu';

export default class NavItem extends Component {  
  constructor(props){
    super(props)
    this.state = {
      expandedKeys: {},
      items: [],
      MenuClass: this.props.MenuClass,
      MenuList: this.props.MenuList,
    }

    this.state.MenuClass.forEach((Class) => {
      const templist = []
      let count = 1;
      this.state.MenuList.forEach((List) => { 
        if(List.groupid === Class.key){
          templist.push({ 
            key: '0_' + count,
            label: List.name,
            url: List.path,
          })
          count++
        }
      });
      
      this.state.items.push({
        key: Class.key,
        label: Class.label,
        icon: Class.icon,
        items: templist
      })
    });

  }

  expandAll = () => {
      this.state.items.forEach(this.expandNode);
      this.setExpandedKeys({ ...this.state.expandedKeys });
  };

  collapseAll = () => {
    this.setExpandedKeys({});
  };

  expandNode = (node) => {
      if (node.items && node.items.length) {
        this.state.expandedKeys[node.key] = true;

          node.items.forEach(this.expandNode);
      }
  };

  render() {
    return (
      <div className="card flex flex-column align-items-center gap-3">
            <PanelMenu model={this.state.items} expandedKeys={this.expandedKeys} onExpandedKeysChange={this.setExpandedKeys} className="w-full md:w-20rem" multiple />
      </div>
    )
  }

}