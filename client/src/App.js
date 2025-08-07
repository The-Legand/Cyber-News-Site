import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Login from './pages/Login';
import Blogs from './pages/Blogs';
import Forum from './pages/Forum';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/blogs" element={<Blogs/>}/>
      <Route path="/forum" element={<Forum/>}/>
      <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
