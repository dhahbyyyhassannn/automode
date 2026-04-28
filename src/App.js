import logo from './logo.svg';
import './assets/variables.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn/>} />
    </Routes>
  );
}

export default App;
