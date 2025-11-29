import { NavLink, useNavigate, Link } from "react-router-dom";
import './Navbar.css';
import {useAuth} from "../context/AuthContext";
export default function Navbar() {

  const {user, isLoggedIn, logout} = useAuth();
  const navigate= useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/blogs" className="nav-link">Blogs</NavLink>
        <NavLink to="/forum"  className="nav-link">Forum</NavLink>
      </div>

      <div className="nav-right">
        {isLoggedIn ?(
          <>
          <span className="nav-greeting">Hi,   {user?.username ?? 
          "User"} </span>
          <Link to="/profile" className="nav-link">Profile</Link>
          <button type="button" className="nav-btn" onClick={()=>{ logout(); navigate("/");}}>Logout</button>
          </>
        ):(
          <>
          <NavLink to="/login" className="nav-link">Login</NavLink>
          <NavLink to="/signup" className="nav-link nav-cta">Signup</NavLink>
          </>
        )}
      </div>
 
    </nav>
  );
}
