import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  const authFetch = useCallback( 
    async (path, options = {})=>{
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if(token){
      headers.set("Authorization", `Bearer ${token}`);
    }

    const hasBody = options.body !== undefined && options.body !==null;
    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${API_BASE}${path}`,{
      ...options,
      headers,
    });

    const contentType = res.headers.get("Content-Type")||"";
    const isJson = contentType.includes("application/json")
    let data = null;

    if (isJson){
    try{
      data = await res.json();
      //console.log(data)
    }
    catch{
      data = null;
    }
  }

    if(!res.ok){
      const msg = (data && (data.error || data.message))|| `HTTP ${res.status}`;
      const err =  new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
       
    }

    return data;
  },
  [token]
);
  const value = {user,isLoggedIn: !!user,signup, login, logout, authFetch};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must by used inside <AuthProvider>");
    return ctx;
}



