import { useState} from "react";
import { useNavigate, Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";




export default function Login(){
    const {login, user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    
//   if(user){
//     return <Navigate to={from} replace/>;
//     }
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setError("");


        try {
            await login({email, password});
            navigate(from, {replace: true});
        }
        catch(err){
            setError(err.message || "Login failed");
            setStatus("error");
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            value = {email}
            onChange={(e)=> setEmail(e.target.value)}
            required/>
        <input 
        type="password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required
        />
        <button type="submit" disabled={status==="loading"}>

        </button>
        {error &&<p>{error}</p>}
        </form>
    );
}