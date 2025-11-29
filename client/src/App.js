import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Forum from "./pages/Forum";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import ProtectedRoute from "./routes/ProtectedRoute";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forum/:id" element={<PostDetail/>}/>
          <Route path="/profile" element={
            <ProtectedRoute>
            <Profile />

            </ProtectedRoute>
            } />
            <Route path="/forum/:id/edit" element={
              <ProtectedRoute>
              <EditPost/>
              </ProtectedRoute>
              }/>
            <Route path="/forum/new" element={
            <ProtectedRoute>
            <NewPost/>
            </ProtectedRoute>}
            />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
