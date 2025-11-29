import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import { useAuth} from "../context/AuthContext";

export default function PostDetail(){
    const {id} = useParams();
    //const {authFetch} = useAuth();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(""
    );
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001"
    useEffect(()=>{
        (async ()=>{
            try{
                const res = await fetch(`${API_BASE}/api/forum/${id}`);

                if(!res.ok) throw new Error(`Failed (${res.status})`);
                const data = await res.json();
                setPost(data);

            }
            catch(e){setError(e.message || "Failed to load post");}
        })();
    }, [id]);

    if(error) return <main className="post-detail"><p>{error}</p></main>;
    if(!post) return <main className="post-detail"><p>Loading...</p></main>;

    return (
        <main className="post-detail">
        <header>
        <h1>{post.title}</h1>
        <p className="meta">
        by <strong>{post.author || "Unknown" }</strong> •{" "}
        <time >{new Date(post.created_at).toLocaleString()}</time>
        </p>
        </header>

        <article className="content-full">{post.content}</article>

        <footer style={{marginTop: "1rem"}}>
        <Link to="/forum">← Back to forum</Link>
        </footer>
        </main>
    );



}