import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import './forum.css'

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001"

export default function Forum(){
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState("loading");
    const { isLoggedIn } = useAuth();


    useEffect(()=>{

        (async()=>{
        try{
            const res = await fetch(`${API_BASE}/api/forum`);
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setPosts(Array.isArray(data.posts) ? data.posts : []);
            setStatus("ready");
        }
        catch(e){
            setStatus("error" );
        } })();
    },[]);

    if (status === "loading") return <p className="forum">Loading...</p>;
    if (status==="error") return <p className = "forum" style={{color: "var(--danger)"}}>Failed to load posts.</p>

const imgFor = () =>
  `https://source.unsplash.com/random/400x240/?cybersecurity,hacking,technology`;




    return (

        <main className="forum">
            <header className="forum-header">
            <h1>Forum</h1>
            {isLoggedIn && (
                <Link className="btn" to="/forum/new">+ New Post</Link>
            )}
            </header>
            {posts.length===0?(<p>No posts yet.</p>):(
                <ul className="postList">
                    {posts.map((p)=>(
                        <li key={p.id} className="postCard">
                            <img className="thumb" src={imgFor()} alt="" loading="lazy"/>
                            <h3 className="postTitle">{p.title}</h3>
                            <p className="postContent">{p.content}</p>
                            <small className="postMeta">by {p.author} • {new Date(p.created_at).toLocaleString()}</small>

                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
