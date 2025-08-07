import { Link } from "react-router-dom";
import './Navbar.css';
export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/blogs">Blogs</Link> |{" "}
      <Link to="/forum">Forum</Link> | <Link to="/login">Login</Link> |{" "}
      <Link to="/signup">Signup</Link> | <Link to="/profile">Profile</Link>
    </nav>
  );
}
