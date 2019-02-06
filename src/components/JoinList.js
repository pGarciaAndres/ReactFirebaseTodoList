import React, { Component } from 'react'
import { Input, Button, Header } from 'semantic-ui-react'

export default class JoinList extends Component {
  state = { value: JoinList.makeid(7) }
  static makeid(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }

  joinTodoList = () => {
    this.props.history.push('/todolist/' + this.state.value)
  }

  changeHandler = event => {
    this.setState({
      value: event.target.value,
    })
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Header as="h4" textAlign="center">
          <Header.Content>
            Join or Create a new Todo List
            <Header.Subheader style={{ maxWidth: '300px' }}>
              Everyone having the name of the todo list can join. You can take a random hash as a name, for security, or
              input your own name.
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Input
          focus
          value={this.state.value}
          onChange={this.changeHandler}
          style={{ maxWidth: '300px', width: '100%' }}
          className="center-text"
        />
        <Button primary style={{ maxWidth: '200px', width: '100%', marginTop: '10px' }} onClick={this.joinTodoList}>
          Create or Join
        </Button>
      </div>
    )
  }
}
