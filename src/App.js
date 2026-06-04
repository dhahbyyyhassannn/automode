import './assets/variables.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddCarPage from './pages/AddCarPage';
import AddFuelExpensesPage from './pages/AddFuelExpensesPage';
import OilChangePage from './pages/OilChangePage';
import CarDetails from './pages/CarDetails';
import DashboardPage from './pages/DashboardPage';
import MyCarsPage from './pages/MyCarsPage';
import RepairExpensesPage from './pages/RepairExpensesPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/addCar" element={<AddCarPage />} />
      <Route path="/fuelForm" element={<AddFuelExpensesPage />} />
      <Route path="/oilChange" element={<OilChangePage />} />
      <Route path="/car/:matricule" element={<CarDetails />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path='/myCars' element={<MyCarsPage />} />
      <Route path='/repairform' element={<RepairExpensesPage />} />
    </Routes>
  );
}
export default App;
