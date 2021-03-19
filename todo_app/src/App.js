import React, {useState} from 'react';
import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export const TokenContext = React.createContext()

function App() {
  const [authToken, setAuthToken] = useState('')
  return (
    <div className="App">
      <Header />
      <main>
        <TokenContext.Provider value={{authToken, setAuthToken:setAuthToken()}}>
          <LoginForm />
        </TokenContext.Provider>
        
        <RegisterForm />
      </main>
      
    </div>
  );
}

export default App;
