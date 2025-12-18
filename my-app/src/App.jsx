import { useState, useEffect } from 'react'
import axios from 'axios'
import TodoItem from './components/TodoItem'
import './index.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos')
      setTodos(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching todos:', error)
      setLoading(false)
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    try {
      const newTodo = {
        text: inputValue,
        completed: false
      }
      const response = await axios.post('/api/todos', newTodo)
      setTodos([...todos, response.data])
      setInputValue('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, { completed })
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header>
          <h1>Tasks</h1>
          <p className="subtitle">{todos.filter(t => !t.completed).length} items remaining</p>
        </header>

        <form onSubmit={handleAddTodo} className="input-group">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </form>

        <div className="todo-list">
          {loading ? (
             <div className="loading">Loading tasks...</div>
          ) : (
            todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggleTodo} 
                onDelete={handleDeleteTodo} 
              />
            ))
          )}
          
          {!loading && todos.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
