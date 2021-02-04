import { Component } from 'react';
// component
import { Input, Toast, ToastBody, ToastHeader } from 'reactstrap';

import axiosInstance from './helper/config';

export class App extends Component {
  state = {
    input: '',
    todos: [],
    error: '',
    success: '',
    loading: false,
    editInd: -1,
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const { data, status } = await axiosInstance.get('/');
      if (status !== 200) throw new Error('Khong fetch duoc data');
      this.setState({ todos: data });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  addTodo = async ({ keyCode }) => {
    const { input, todos, success } = this.state;
    if (keyCode === 13) {
      try {
        const { data } = await axiosInstance.post('/', {
          title: input,
          checked: false,
        });
        this.setState({ todos: todos.concat(data), success: 'Success !!', input: '' });
        setTimeout(() => {
          this.setState({ success: '' });
        }, 1000);
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  checkedTodo = async (ind, id, checked) => {
    const { todos } = this.state;
    try {
      await axiosInstance.put(`/${id}`, { checked });
      const newTodos = [...todos];
      newTodos[ind].checked = checked;
      this.setState({ todos: newTodos });
    } catch (error) {
      this.setState({ error });
    }
  }

  editTodo = async (ind, id, keyCode) => {
    const { todos } = this.state;
    if (keyCode === 13) {
      await axiosInstance.put(`/${id}`, { title: todos[ind].title });
      this.setState({ editInd: -1 });
    }
  }

  render() {
    const {
      input,
      loading,
      todos,
      editInd,
      error,
      success,
    } = this.state;
    return loading ? (
      <div>Loading...</div>
    ) : (
        <div>
          <Input
            value={input}
            onChange={({ target }) => this.setState({ input: target.value })}
            onKeyDown={this.addTodo}
          />
          {todos.map(({ id, title, checked }, ind) => (
            <div
              key={id}
            >
              {
                ind === editInd ? (
                  <input
                    value={title}
                    onChange={({ target }) => {
                      const newTodos = [...todos];
                      newTodos[ind].title = target.value;
                      this.setState({ todos: newTodos });
                    }}
                    onKeyDown={({ keyCode }) => this.editTodo(ind, id, keyCode)}
                  />
                ) : (
                    <div
                      onClick={() => this.setState({ editInd: ind })}
                    >{title}</div>
                  )
              }
              <input
                type="checkbox"
                checked={checked}
                onChange={({ target }) => this.checkedTodo(ind, id, target.checked)}
              />
            </div>
          ))}
          <Toast isOpen={Boolean(success)}>
            <ToastHeader toggle={() => this.setState({ success: '' })}>
              Reactstrap
            </ToastHeader>
            <ToastBody>
              {success}
            </ToastBody>
          </Toast>
        </div>
      )
  }
}

export default App
