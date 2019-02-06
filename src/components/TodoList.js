import React, { Component } from 'react'
import { List, Input, Button, Icon } from 'semantic-ui-react'
import Emoji from 'node-emoji'
import { firebaseDocument } from '../adapters/firebase'

export default class TodoList extends Component {
  constructor(props) {
    super(props)

    // Init this component with an empty list of todos (fetched later from DB)
    // and "loading: true" for showing a loading message
    this.state = {
      todos: [],
      value: '',
      placeholderValue: 'Your first todo of the day',
      loading: true,
    }

    // Gets the current todolist id from the URL
    this.todolistId = this.props.match.params.id

    // Create a reference to the specific todolist data in the Firebase database
    this.firebaseDocument = firebaseDocument('todoList', this.todolistId)
  }

  syncTodosWithDatabase() {
    // Syncing the entire todoList over to the firebase server
    this.firebaseDocument.set({ todos: this.state.todos })
  }

  componentDidMount() {
    /* We subscribe to realtime changes in our database and give it
     * a function to call with the new data. In this case we just set our
     * state to the new data :)
     */
    this.firebaseDocument.subscribe(data => {
      // Data on the server could be empty for the particular todolistId, so we have to catch that
      if (data) {
        this.setState({ todos: data.todos })
      }
      this.setState({ loading: false })
    })
  }

  componentWillUnmount() {
    // When the component is unmounted, we want to cancel the subscription to the firebase changes
    this.firebaseDocument.unsubscribe()
  }

  onInputChangeEvent = event => {
    document.addEventListener('keydown', this.handleKeyPress, false)
    this.setState({
      value: event.target.value,
    })
  }

  addTodo = () => {
    if (this.state.value !== undefined) {
      let formatSentence = this.state.value.charAt(0).toUpperCase() + this.state.value.slice(1)
      const todoIndex = this.state.todos.findIndex(t => t.text === formatSentence)

      if (todoIndex > -1) {
        const newTodos = [...this.state.todos]
        newTodos[todoIndex].status = 'default'
        this.setState(
          {
            todos: newTodos,
            value: '',
          },
          this.syncTodosWithDatabase
        )
      } else {
        let newTodo = {
          id: this.state.todos.length + 1,
          text: formatSentence,
          status: 'default',
          priority: 'medium',
          edit: false,
        }
        let todos = [...this.state.todos, newTodo]
        let placeholderValue = 'Type in your next Todo'

        this.setState(
          {
            todos,
            placeholderValue,
            value: '',
          },
          this.syncTodosWithDatabase
        )
      }
    }
  }

  deleteTodo = event => {
    const todoIdWeWantToDelete = event.target.id
    const todoCopy = [...this.state.todos]
    // The following comment disables an eslint warning temporary because we need a "==" instead of an "===" here to cast types
    // eslint-disable-next-line eqeqeq
    const filteredTodos = todoCopy.filter(todo => todo.id != todoIdWeWantToDelete)

    this.setState(
      {
        todos: filteredTodos,
      },
      this.syncTodosWithDatabase
    )
  }

  handleDone = event => {
    let newTodos = this.state.todos.map(todo => {
      // eslint-disable-next-line eqeqeq
      if (todo.id == event.target.id) {
        const newStatus = todo.status === 'done' ? 'default' : 'done'
        return { ...todo, status: newStatus }
      } else {
        return todo
      }
    })
    this.setState(
      {
        todos: newTodos,
      },
      this.syncTodosWithDatabase
    )
  }

  handleEdit = event => {
    let newTodos = this.state.todos.map(todo => {
      // eslint-disable-next-line eqeqeq
      if (todo.id == event.target.id) {
        const text = todo.newText
        const newText = ''
        const edit = false
        return { ...todo, status: 'default', text, newText, edit }
      } else {
        return todo
      }
    })
    this.setState(
      {
        todos: newTodos,
      },
      this.syncTodosWithDatabase
    )
  }

  cancelEdit = event => {
    let newTodos = this.state.todos.map(todo => {
      // eslint-disable-next-line eqeqeq
      if (todo.id == event.target.id) {
        const newText = ''
        const edit = false
        return { ...todo, status: 'default', newText, edit }
      } else {
        return todo
      }
    })
    this.setState(
      {
        todos: newTodos,
      },
      this.syncTodosWithDatabase
    )
  }

  handleKeyPress = event => {
    if (event.key === 'Enter' && event.target.value !== '') {
      event.target.id === '' ? this.addTodo(event) : this.handleEdit(event)
    }
    if (event.key === 'Escape' && event.target.id !== '') {
      this.cancelEdit(event)
    }
  }

  leftIcon = todo => {
    if (todo.edit) {
      return 'pencil icon'
    } else {
      if (todo.status === 'done') {
        return 'undo icon'
      } else {
        return 'check icon'
      }
    }
  }

  rightIcon = todo => {
    if (todo.edit) {
      return 'cancel icon'
    } else {
      return 'trash icon'
    }
  }

  leftColor = todo => {
    if (todo.edit) {
      return 'yellow'
    } else {
      if (todo.status === 'done') {
        return 'grey'
      } else {
        return 'green'
      }
    }
  }

  onChangeEvent = event => {
    const todoCopy = [...this.state.todos]
    const newTodos = todoCopy.map(todo => {
      // eslint-disable-next-line eqeqeq
      if (todo.id == event.target.id) {
        return { ...todo, edit: true, newText: event.target.value }
      } else {
        return todo
      }
    })

    this.setState({
      todos: newTodos,
    })
    document.addEventListener('keydown', this.handleKeyPress, false)
  }

  enableEventListener = todo => {
    console.log(todo)
  }

  TodoListRow = props => {
    const todo = props.todo
    return (
      <List.Item>
        <Input id={todo.id} value={todo.edit ? todo.newText : todo.text} type="text" action>
          <input
            className={todo.status === 'done' ? 'doneTask' : ''}
            disabled={todo.status === 'done' ? true : false}
            onChange={this.onChangeEvent}
          />
          <Button
            icon
            id={todo.id}
            onClick={todo.edit ? this.handleEdit : this.handleDone}
            color={this.leftColor(props.todo)}
          >
            <Icon id={todo.id} className={this.leftIcon(props.todo)} />
          </Button>

          <Button icon id={todo.id} onClick={todo.edit ? this.cancelEdit : this.deleteTodo} color="red">
            <Icon id={todo.id} className={this.rightIcon(props.todo)} />
          </Button>
        </Input>
      </List.Item>
    )
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>
    }

    const moveDoneListToTheEnd = (prev, current) => (current.status === 'done' ? -1 : 1)
    const todos = this.state.todos.sort(moveDoneListToTheEnd)

    return (
      <React.Fragment>
        <div className="todolist">
          <Input
            autoComplete="off"
            list="todos"
            type="text"
            name="todo"
            value={this.state.value}
            placeholder={this.state.placeholderValue}
            onChange={this.onInputChangeEvent}
            action={{
              content: 'Add Task',
              onClick: this.addTodo,
              primary: true,
              disabled: this.state.value === '',
            }}
          />
          <datalist id="todos">
            {this.state.value.length >= 3 &&
              todos
                .filter(todo => todo.status === 'done')
                .map(todo => {
                  return <option key={todo.id} value={todo.text} />
                })}
          </datalist>
          {this.state.todos.length >= 1 ? (
            <List divided verticalAlign="middle">
              {todos.map(todo => (
                <this.TodoListRow key={todo.id} todo={todo} />
              ))}{' '}
            </List>
          ) : (
            <h3 style={{ textAlign: 'center' }}>There are no todos right now {Emoji.get('coffee')}</h3>
          )}
        </div>
      </React.Fragment>
    )
  }
}
