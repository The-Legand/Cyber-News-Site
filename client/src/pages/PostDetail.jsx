import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export default function PostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { authFetch, isLoggedIn, user } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const successMessage = location.state?.success;

  useEffect(() => {
    if (location.state?.success) {
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);
  // aded in order to debug status code issues(status code not showing) with authFetch
  //     async function debugAuthFetchStatus() {
  //   try {
  //     await authFetch("/api/forum/999999", { method: "DELETE" });
  //     console.log("DEBUG: delete succeeded (unexpected)");
  //   } catch (e) {
  //     console.log("DEBUG message:", e.message);
  //     console.log("DEBUG status:", e.status);
  //     console.log("DEBUG full error:", e);
  //  }
  //}

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/forum/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error(`Failed (${res.status})`);
        }
        const data = await res.json();
        setPost(data.post);
      } catch (e) {
        setError(e.message || "Failed to load post");
      }
    })();
  }, [id]);

  const canManage =
    !!post &&
    isLoggedIn &&
    (user?.id === post.user_id || user?.role === "admin");

  async function handleDelete() {
    if (!post) return;
    const ok = window.confirm("Delete this post?");

    if (!ok) return;

    try {
      setError("");
      await authFetch(`/api/forum/${post.id}`, {
        method: "DELETE",
      });
      navigate("/forum", {state: {message:"Post deleted sucessully"}});
    } catch (e) {
      if (e.status === 401) {
        navigate("/login", {state:{message: "Please log in to continue"}});
      } else if (e.status === 403) {
        setError("Forbidden: Only admin or post owner can delete this post");
      } else if (e.status===404) {
        setError("Post not found. In might have already been deleted");
      } else setError(e.message||"Delete failed");
    }
  }

  if (error)
    return (
      <main className="post-detail">
        <p>{error}</p>
      </main>
    );
  if (!post)
    return (
      <main className="post-detail">
        <p>Loading...</p>
      </main>
    );

  return (
    <main className="post-detail">
      {successMessage && <p className="success">{successMessage}</p>}
      <header>
        <h1>{post.title}</h1>
        <p className="meta">
          by <strong>{post.author || "Unknown"}</strong> •{" "}
          <time>{new Date(post.created_at).toLocaleString()}</time>
        </p>
      </header>

      <article className="content-full">{post.content}</article>

      <footer style={{ marginTop: "1rem", display: "flex", gap: "12px" }}>
        <Link to="/forum">← Back to forum</Link>

        {canManage && (
          <>
            <Link to={`/forum/${post.id}/edit`}>Edit</Link>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </footer>
    </main>
  );
}
