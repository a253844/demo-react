import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

export default class InputItem extends Component {  
  constructor(){
    super()
    this.state = {
      user: {
        name: null,
        email: null,
        hero: null,
        accept: true
      },
      heroes: [
        { value: 11, text: "Mr. Nice" },
        { value: 12, text: "Narco" },
        { value: 13, text: "Bombasto" },
        { value: 14, text: "Celeritas" },
        { value: 15, text: "Magneta" },
        { value: 16, text: "RubberMan" },
        { value: 17, text: "Dynama" },
        { value: 18, text: "Dr IQ" },
        { value: 19, text: "Magma" },
        { value: 20, text: "Tornado" }
      ]
    }
  }
  handleChange(name, value) {
    let user = Object.assign({}, this.state.user);
    user[name] = value;
    this.setState({ user: user })
  }
  handleSubmit() {
    //...
  }

  render() {
    return (
      <div>
      <h2>Basic Form</h2>
      <Form
        style={{ maxWidth: 500 }}
        model={user}
        labelWidth={120}
        labelAlign="right"
        onChange={this.handleChange.bind(this)}
      >
        <FormField name="name" label="Name:">
          <TextBox></TextBox>
        </FormField>
        <FormField name="email" label="Email:">
          <TextBox></TextBox>
        </FormField>
        <FormField name="hero" label="Select a hero:">
          <ComboBox data={heroes}></ComboBox>
        </FormField>
        <FormField name="accept" label="Accept Me:">
          <CheckBox checked={user.accept}></CheckBox>
        </FormField>
        <FormField style={{ marginLeft: 120 }}>
          <LinkButton onClick={this.handleSubmit.bind(this)}>Submit</LinkButton>
        </FormField>
      </Form>
      <p>{JSON.stringify(user)}</p>
    </div>
    )
  }

}