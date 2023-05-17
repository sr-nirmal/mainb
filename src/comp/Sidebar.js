import { useState } from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import Upload from './upload';
import Receipt from './Recipt';
import Login from './login';
import Home from './home'
import './sidebar.css';
import Loading from './loading';
import home from '../images/homeimg.png'
import History from './history';
// import {Rxhome} from 'react-icons/Rx'

function Sidebar(props) {
  const [currentState, setCurrentState] = useState(0);

  const handleLogout = () => {
    fetch('/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"name": props.name })
    })
    .then(response => response.json())
    .then(data => {
      setCurrentState(-1);
      props.onLogout();
    })
    .catch(error => {
        console.error('Error:', error);
    });
      

    };

  const renderHeading = () => {
    if (currentState === 0) return 'Home';
    if (currentState === 1) return 'Upload';
    if (currentState === 2) return 'Receipts';
    if (currentState === 4) return 'History';
  };
  function changeState(value) {
    console.log("Function calles -> ")
    setCurrentState(value);
  }

  const renderContent = () => {
    if (currentState === 0) return <Home className='init' name={props.name} />;
    if (currentState === 1) return <Upload name={props.name} changeState={changeState} />;
    if (currentState === 2) return <Receipt name={props.name} />;
    if (currentState === 3) return <Loading />;
    if (currentState === 4) return <History name={props.name} />;
    if (currentState === -1) return <Login />;
  };

  return (
    <div className='main'>
      <div className='sidebar'>
        <div className='sidebar-title-container'>
          <h1 className='sidebar-title'>Receipt-Scan</h1>
        </div>
        <div className='sidebar-user-container'>
          <h2 className='sidebar-user'>Hello {props.name}</h2>
        </div>

        <div className='sidebar-buttons-container'>
          <div className='menu-bar'>
            <button className='menu-btn' onClick={() => setCurrentState(0)}>
              {/* <Rxhome size='80px' className='home'/> */}
              Home
            </button>
            <button className='menu-btn' onClick={() => setCurrentState(1)}>
              Upload
            </button>
            <button className='menu-btn' onClick={() => setCurrentState(4)}>
              History
            </button>
            <button className='menu-btn' onClick={() => setCurrentState(2)}>
              Receipt
            </button>
          </div>
        </div>

        <div className='logout-btn-container'>
          <button id='logout-btn' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className='dashboard-container'>
        <div className='dashboard-heading'>
          <div className='init'>{renderHeading()}</div>
        </div>
        <div className='dashboard-content'>
          <div className='dashboard-box'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
