import { useState} from "react";
import { useNavigate, Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";




export default function Login(){
    const {login, user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";
    const msg = location.state?.message;

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
        <>
        {msg && <p className="info">{msg}</p>}
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            value = {email}
            onChange={(e)=> setEmail(e.target.value)}
            required/>
        <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required
        />
        <button type="submit" disabled={status==="loading"}>
            {status==="loading" ? "Loggin in...":"Login"}

        </button>
        {error &&<p className="error">{error}</p>}
        </form>
        </>
    );
}