import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './comp/login';
// import Receipt from './comp/Receipt';
import Sidebar from './comp/Sidebar';
import Upload from './comp/upload';
import Loading from './comp/loading';
//import Upload from './comp/upload';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>


  );
}

export default App;
