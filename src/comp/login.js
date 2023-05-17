import React, { useState } from 'react';
// import {Link } from 'react-router-dom';
import './login.css';
import Sidebar from './Sidebar.js';


function Login() {
  const [inputName, setInputname] = useState("");
  const [name, setName] = useState('');

  function handleSubmit(event) {
    
    event.preventDefault();
    
    console.log(inputName);
    fetch('/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "name": inputName })
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === "success") {
          setName(inputName);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function handleLogout() {
    setName('');
    setInputname('');
  }

  function handleChange(event) {
    setInputname(event.target.value);
  }

  return (
    <div className="container">
      {name === '' && (
        <div className="form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="form-title">Login</h1>
            <div className="form-field">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" id="name" className="form-input" value={inputName} onChange={handleChange} />
            </div>
            <button type='submit' className="form-button">Submit</button>
          </form>
        </div>
      )}
      {name !== '' && (
        <Sidebar name={name} onLogout={handleLogout} />
      )}
    </div>
  );

}

export default Login;
