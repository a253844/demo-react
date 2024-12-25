import React, { Component } from 'react';
import PropTypes from 'prop-types'

export default class Test extends Component {  
  constructor(){
    super()
    //物件
    this.state = {
      count : 0
    }

  }

  //組件結構函數，性能最好，僅創建一次，渲染不重複創建
  showlist1(arr) {
    return arr.map((item) => (
        <li key={item.id}>
          <h1>{item.id}</h1>
          <p>{item.name}</p>
        </li>
    ));
  }

  showlist2 = (arr) => {
    return arr.map((item) => (
        <li key={item.id}>
          <h1>{item.id}</h1>
          <p>{item.name}</p>
        </li>
    ));
  }

  addcount1() {
    //設置物件參數值
    this.setState({
      count : this.state.count +1
    })
    //調用物件後，設置物件參數值
    this.setState((state) => {
      return {
        count : state.count +2
      }
    })
  }

  addcount2 = () => {
    //設置物件參數值
    this.setState({
      count : this.state.count +1
    })
    //調用物件後，設置物件參數值
    this.setState((state) => {
      return {
        count : state.count +2
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.count}
        <br />
        {this.state.count < 20 ? this.state.count : "超過了!"}
        <br />
        <p>showlist1</p>
        <ul>
          {this.showlist1(this.props.propArr1)}
        </ul>
        <p>showlist2</p>
        <ul>
          {this.showlist2(this.props.propArr2)}
        </ul>
        <p>LoginBox</p>
          <this.props.LoginBox />
          {this.props.LoginBoxobj}
        <p>obj</p>
          {this.props.userid}
          <br />
          {this.props.date}
          <br />
          {this.props.Key}
        <br />
        <button onClick={() => { this.addcount1() }}>addcount1</button>
        <br />
        <button onClick={this.addcount2 }>addcount2</button>
      </div>
    )
  }

}

Test.propTypes = {
  propArr1: PropTypes.array.isRequired
}

Test.defaultProps = {
  propArr1: [
      {id: 0, name : 'default'},
      {id: 1, name : 'default'},
      {id: 2, name : 'default'},
      {id: 3, name : 'default'},
  ]
}
