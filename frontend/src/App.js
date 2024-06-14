import './App.css';
import { useState } from 'react';
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './components/Home.js';
import Profile from './components/Profile.js';
import DisplayItem from './components/DisplayItem.js';
import Bookmark from './components/Bookmark.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Alert from './components/Alert.js';
import Dashboard from './components/Dashboard.js';
import CodeBlock from './components/CodeBlock.js';
import NoteAction from './context/notes/NoteAction.js';
import AuthAction from './context/notes/AuthAction.js';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500)
  }
  return (
    <>
      <AuthAction>
        <NoteAction>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<>
                <Navbar showAlert={showAlert} />
                <Alert alert={alert} />
                <Outlet />
              </>}>
                <Route index element={<Home />} />
                <Route path='/dashboard' element={<Dashboard showAlert={showAlert} />} />
                <Route path='/profile' element={<Profile showAlert={showAlert}/>} />
                <Route path='/DisplayItem/:postId' element={<DisplayItem showAlert={showAlert}/>} />
                <Route path='/bookmark' element={<Bookmark showAlert={showAlert} />} />
                <Route path='/codeBlock' element={<CodeBlock language='c_cpp' />} />
                <Route path='/login' element={<Login showAlert={showAlert} />} />
                <Route path='/signup' element={<Signup showAlert={showAlert} />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NoteAction>
      </AuthAction>
    </>
  );
}

export default App;
