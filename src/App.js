import React, { Component } from 'react'
import './App.scss'
import Emoji from 'node-emoji'
import { Header, Icon, Card } from 'semantic-ui-react'
import { Route } from 'react-router-dom'
import TodoList from './components/TodoList'
import JoinList from './components/JoinList'
import Footer from './components/Footer'

class App extends Component {
  render() {
    // You can Ctrl+Click on "TodoList" to open the file where it is defined in
    return (
      <div>
        <div className="container">
          <Header as="h2" icon textAlign="center" style={{ marginTop: '80px' }}>
            <Icon>{Emoji.get('fire')}</Icon>
            Lit-Todo
            <Header.Subheader>Awesome WEBDEV Todo-App</Header.Subheader>
          </Header>
          <Card fluid>
            <Card.Content>
              <Route path="/" exact render={props => <JoinList {...props} />} />
              <Route path="/todolist/:id(.*)" render={props => <TodoList {...props} />} />
            </Card.Content>
          </Card>
        </div>
        <Route path="/todolist/:id(.*)" render={props => <Footer {...props} />} />
      </div>
    )
  }
}

export default App
