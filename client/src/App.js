import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Home from './components/home';
import Login from './components/login';
import Allusers from './components/allusers';
import Register from './components/register';
import Auth from './components/hoc/auth';
import Chat from './components/chat';
import ChatBox from './components/chatBox';

function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path='/' component={Auth(Home)} />
      <Route exact path='/login' component={(Login)} />
      <Route exact path='/register' component={(Register)} />
      <Route exact path='/allusers' component={Auth(Allusers)} />
      <Route exact path='/chat' component={Auth(Chat)} />
      <Route exact path='/chat/:id' component={Auth(ChatBox)} />
      <footer className="footer" id="footerID">
        <p>Copyright ©2021 Nishant Rana
              <a href="https://www.instagram.com/nishant._.rana_/" rel="noreferrer" target="_blank">
            <i className="fa fa-instagram"> </i>
          </a>
          <a href="https://github.com/nishant007-tech" rel="noreferrer" target="_blank">
            <i className="fa fa-github"></i>
          </a>
        </p>
      </footer>
    </Router>
  );
}

export default App;
