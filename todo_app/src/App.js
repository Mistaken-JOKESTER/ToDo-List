import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import AddTask from './components/AddTask';
import Error from './components/Error';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TaskList from './components/TaskList';
import fetchTasks from './fucntions/fetchTasks';

function App() {

  //creating reference for input
  const focusRef = useRef(null)

  //States
  const [authToken, setAuthToken] = useState('')
  const [showForm, setShowForm] = useState(1)
  const [userName, setUserName] = useState('Welcome User')
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')

  //fetching tasks if JSON web token is presend in local storage
  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('TodoListData'))
    console.log(data)
    if(data === null || data.name == null || data.authToken == null){
      setAuthToken(null)
      window.localStorage.setItem('TodoListData', null)
    } else {
      setAuthToken(data.authToken)
      fetchTasks(data.authToken, setTodos)
      setUserName(data.name)
    }
  }, [authToken])


  //Focusing input of login and register form
  useEffect(() => {
    focusInput()
  }, [showForm])

  //function to exexute focus on focusRef
  const focusInput = () => {
    focusRef.current.focus()
  }

  //Function to add to tasks
  const addToTodos = ({discription, task_id}) => {
    setTodos([
      {
        discription,
        task_id,
        status:0
      },
      ...todos
    ])
  }

  //Function to clear errors
  const clearError = () => {
    setError('')
  }

  //JSX to be rendered
  return (
    <div className="App">
      <Header
        userName={userName}
        isLoggedIn={authToken?true:false}
        setAuthToken={setAuthToken}
        authToken = {authToken}
      />
      <main>
        <Error error={error} clearError={clearError}/>
        {
          authToken 
          ?
            <>
              <AddTask 
                authToken={authToken}
                addToTodos={addToTodos}
              />
              <TaskList todos={todos} setTodos={setTodos} token={authToken} setError={setError}/>
            </>
          :
            <h1>
              <LoginForm 
                show={showForm === 1?true:false} 
                setShowForm={setShowForm} 
                focusInput={focusInput} 
                focusRef={focusRef}
                setAuthToken={setAuthToken}  
                setUserName={setUserName}
                setError={setError}
              />
              <RegisterForm 
                show={showForm === -1? true: false} 
                setShowForm={setShowForm} 
                focusInput={focusInput} 
                focusRef={focusRef}
                setError={setError}
              />
            </h1>
        } 
      </main>
    </div>
  );
}

export default App;
