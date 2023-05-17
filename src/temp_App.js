import './App.css';
import Top from './comp/top';
import Right from './comp/right';
import Upload from './comp/upload';
import Login_frame from './comp/login';
import { useState } from 'react';

function App(){
    const [currentState, setcurrentState]=useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        
        e.preventDefault();
    
        fetch('/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.result);
            if(data.result == "success"){
            setcurrentState(1)
            }
            // Handle the response from the server
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function LoginFrame(){
        return (
            <div>
              <h1>Login Page</h1>
              <form onSubmit={handleLogin}>
                <label>
                  Username:
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Password:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <br />
                <button type="submit">Login</button>
              </form>
            </div>
          );
        }
        function DashBoard(){
            return (
                <div>
                    <button className='logout' onClick={setcurrentState(0)}>LOGOUT</button>
                    <Top></Top>
                    <Right></Right>
                </div>
            );
        }
        return (
            <div>
                {currentState===0 && (
                    <LoginFrame />
                )
                }
                {currentState===1 &&
                (
                    <div>
                        <button className='logout' onClick={setcurrentState(0)}>LOGOUT</button>
                        <Top></Top>
                        <Right></Right>
                    </div>
                )
                    
                }
            </div>
        );

    
}