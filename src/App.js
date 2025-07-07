
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Adminpage from './pages/Adminpage';
import DashboardPages from './pages/DashboardPages';
import ViewLeaves from './components/Dashboard/ViewLeaves';

function App() {
  return (
    <div >
     <Navbar/>
     <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPages/>} />
        <Route path="/all-leaves" element={<ViewLeaves/>} />
        <Route path="/admin/*" element={<Adminpage/>} />  /* – this tells React Router that nested routes will be handled inside AdminDashboard.*/
      </Routes>
    </div>
  );
}


export default App;
