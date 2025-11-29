import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function Signup(){
    const {signup} = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setError("");
    

    try{
        await signup({username, email, password});
        navigate("/profile", {replace: true});

    }

    catch(err){
        setError(err.message || "Signup failed");
        setStatus("error");
        
    }

    finally {
        if (status === "loading") setStatus("idle");
    }
}

return (
    <main className="auth-page">
        <h2>Create your account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
        <label>
            Username
            <input
            type="text"
            value={username}
            autoComplete="username"
            onChange ={(e)=>setUsername(e.target.value)}
            minLength={2}
            required
            />
        </label>
        <label>
            Email
            <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e)=>setEmail(e.target.value)}
            required
            />
        </label>

        <label>
            Password
            <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e)=>setPassword(e.target.value)}
            minLength={8}
            required
            />
        </label>
        <button type="submit" disabled={status==="loading"}>

        </button>

        {error && <p className="error">{error}</p>}
        </form>
    </main>


)
}