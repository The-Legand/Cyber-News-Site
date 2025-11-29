import { createContext, useContext, useState, useEffect } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const STORAGE_KEY = "cybernews_auth_v1";
  const [token, setToken] = useState(null);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const saved = JSON.parse(raw);
        if(saved?.token && saved?.user){
          setToken(saved.token);
          setUser(saved.user);
        }
      }
    }
    catch{}
  },[])


async function signup({username, email, password}) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, email, password}),

  });

  const isJson = res.headers.get("Content-Type")?.includes("application/json");

  if (!res.ok) {
    const data = isJson ? await res.json().catch(()=>({})) : {};
    const msg = data.error || data.message || `signup failed (${res.status})`;
    throw new Error(msg);
  }
  const data = isJson ? await res.json() : null;
  console.log(data.token)
  
  if (!data?.token || !data?.user) {
    throw new Error("Invalid signup response");
  }

  setUser(data.user);
  setToken(data.token);
  localStorage.setItem(
    STORAGE_KEY, JSON.stringify({token: data.token, user: data.user})
  );

  return data.user;


}

  async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let msg = `login failed (${res.status})`;

      try {
        const data = await res.json();
        msg = data?.error || data?.message || msg;
      } catch {} // here to assure that the server won't crash if the server will respond as text and not json(therefore res.json will throw an error)
      throw new Error(msg);
    }

    const data = await res.json();
    if(!data?.token ||!data?.user){ throw new Error("Invalid login response");
    }
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({token: data.token, user: data.user}));


  }

  function logout(){
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function authFetch(url, options = {}){
    if(!token){
      throw new Error("Not authenticated");
    }

    const res = await fetch(`${API_BASE}${url}`,{
      ...options,
      headers:{
        ...options.headers,
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`,
      },
    });

    let data;
    try{
      data = await res.json();
    }
    catch{
      data = null;
    }

    if(!res.ok){
      const msg = (data && (data.error || data.message))|| `HTTP ${res.status}`;
      throw new Error(msg);
       
    }

    return data;
  }
  const value = {user,isLoggedIn: !!user,signup, login, logout, authFetch};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must by used inside <AuthProvider>");
    return ctx;
}



