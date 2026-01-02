import { useState } from "react";
import { useNavigate, Link, replace } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NewPost() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    try {
      const result = await authFetch("/api/forum", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      console.log("Post created successfully:", result.post);

      navigate(`/forum/${result.post.id}`, {
        replace: true,
        state: {
          success: "Post created successfully",
        },
      });
    } catch (err) {
      console.error("Create post failed:", err);

      setStatus("error");
      setError(err.message || "Failed to create post");
    } finally {
      if (status === "saving") setStatus("idle");
    }
  }

  return (
    <main className="forum new-post">
      <header className="forum-header">
        <h1>Create a New Post</h1>
        <Link className="btn btn-secondary" to="/forum">
          ← Back to Forum
        </Link>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={8}
            required
          />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={50}
            rows={8}
            required
          />
        </label>
        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Publishing..." : "Publish"}
        </button>
        {error && <p className="error">{error}</p>}
        {status === "success" && <p>Post created successfully!</p>}
      </form>
    </main>
  );
}
