import React, { Component } from 'react';
import SelectItem from '../Item/SelectItem'
import InputItem from '../Item/InputItem'
import CheckboxItem from '../Item/CheckboxItem'
import ButtonItem from '../Item/ButtonItem'

export default class DataInfo extends Component {  
  constructor(){
    super()

    this.state = {
      count : 0,

      UserInfo:{
        userid: 123456,
        date:"2020-01-01",
        Key:"123456789987654321",
      },

      options:
      [
        { value : 1, name : "luna"},
        { value : 2, name : "sun"},
        { value : 3, name : "Venus"},
        { value : 4, name : "Jupiter"},
        { value : 5, name : "Mars"}
      ]
    }
  }

  render() {
    return (
      <div>
        <InputItem 
          Label={"UserId"}
          Type={"input"}
          Disabled={true}
          Descrip={"Check Uour UserId is correct"}>
        </InputItem>
        <InputItem
          Label={"Key"}
          Type={"input"}
          Disabled={true}
          Descrip={"Check Uour Key is correct"}
        ></InputItem>
        <InputItem
          Label={"Date"}
          Type={"input"}
          Disabled={true}
          Descrip={"Check Uour Date is correct"}
        ></InputItem>
        <SelectItem
          Label={"planet"}
          Disabled={false}
          OptionsDescrip={"choose your planet"}
          Options={this.state.options}
        ></SelectItem>
        <CheckboxItem
          Type={"checkbox"}
          label={"I Don't want Sand Massage for Me"}
          Disabled={false}
        ></CheckboxItem>
        <ButtonItem
          Type={"submit"}
          label={"Submit"}
        ></ButtonItem>
      </div>
    )
  }

}