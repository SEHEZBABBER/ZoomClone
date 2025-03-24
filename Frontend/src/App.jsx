import './App.css'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import LandingPage from './pages/landingpage';
import AuthenticationPage from './pages/AuthenticationPage';
function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/auth' element={<AuthenticationPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
