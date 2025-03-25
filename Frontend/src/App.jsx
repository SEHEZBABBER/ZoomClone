import './App.css'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import LandingPage from './pages/landingpage';
import AuthenticationPage from './pages/AuthenticationPage';
import { userContext, UserProvider } from './context/userContext';
import { useEffect } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import VideoComponent from './pages/VideoComponent';
import Room from './pages/Room';
function App() {
  const { setusername } = useContext(userContext);
  useEffect(()=>{
    axios.get("http://localhost:8000/userdata",{withCredentials:true})
    .then((res)=>setusername(res.data.message));
  },[]);
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/auth' element={<AuthenticationPage/>}/>
        <Route path='/joincall' element={<VideoComponent/>}/>
        <Route path='/room/:roomId' element={<Room/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
