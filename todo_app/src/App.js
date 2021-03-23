import React, {useState, useEffect} from 'react';
import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export const TokenContext = React.createContext()

function App() {

  const [authToken, setAuthToken] = useState('')
  const [showForm, setShowForm] = useState(-1)

  useEffect(() => {
    const token = window.localStorage.getItem('TodoListAuthToken')
    if(token === null || token === ''){
      setAuthToken(null)
    }

    console.log(authToken?true:false, showForm === -1? true: false)
  }, [])

  const formHandler = (value) => {
    setShowForm(value)
  }

  return (
    <div className="App">
      <Header />
      <main>
        <LoginForm isLoggedIn={authToken?true:false} show={showForm === 1?true:false} setShowForm={setShowForm}/>
        <RegisterForm isLoggedIn={authToken?true:false} show={showForm === -1? true: false} setShowForm={setShowForm}/>
      </main>
      
    </div>
  );
}

export default App;
