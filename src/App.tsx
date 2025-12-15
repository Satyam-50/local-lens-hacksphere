import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Landing from "./Landing";

/* ================= TYPES ================= */

type Category = "all" | "news" | "culture" | "business" | "music";

type Attachment = {
  type: "image" | "video" | "link";
  src: string;
};

type Comment = {
  _id: string;
  user: {
    _id: string;
    fullName: string;
  };
  text: string;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  author: {
    _id: string;
    fullName: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
  attachments?: Attachment[];
};

/* ================= SIGNUP ================= */

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("All fields are required");
      return;
    }

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      alert(data?.error || "Signup failed");
      return;
    }

    alert("Signup successful! Please log in.");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Create your account</h2>

        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleSignup}>
          Register
        </button>
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const token = localStorage.getItem("token");
  const isLoggedIn = token && token !== "null" && token !== "undefined";

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const addPost = async () => {
    if (!isLoggedIn) {
      alert("Login required to post");
      return;
    }

    if (!title.trim() || !desc.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: desc,
          category: activeCategory === "all" ? "news" : activeCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to post");
        return;
      }

      setPosts((prev) => [data, ...prev]);
      setTitle("");
      setDesc("");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const likePost = async (postId: string) => {
    if (!isLoggedIn) {
      alert("Login required to like");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Like failed");
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, likes: Array(data.likes).fill("") }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      alert("Like failed");
    }
  };

  const addComment = async (postId: string) => {
    if (!isLoggedIn) {
      alert("Login required to comment");
      return;
    }

    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Comment failed");
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Comment failed");
    }
  };

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="left">
          <button className="icon-btn" onClick={() => setMenuOpen(true)}>☰</button>
          <button className="icon-btn">🔍</button>
        </div>

        <button className="logo" onClick={() => navigate("/")}>
          LocalLens
        </button>

        <div className="right">
          {!isLoggedIn ? (
            <>
              <button className="ghost" onClick={() => navigate("/")}>Home</button>
              <button className="primary" onClick={() => navigate("/login")}>Sign in</button>
            </>
          ) : (
            <button
              className="ghost"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/"); // ✅ Goes back to landing page
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* NAV */}
      <nav className="nav">
        <span onClick={() => setActiveCategory("all")}>Home</span>
        <span onClick={() => setActiveCategory("news")}>News</span>
        <span onClick={() => setActiveCategory("culture")}>Culture</span>
        <span onClick={() => setActiveCategory("business")}>Business</span>
        <span onClick={() => setActiveCategory("music")}>Music</span>
      </nav>

      {/* SIDEBAR */}
      {menuOpen && (
        <>
          <div className="overlay" onClick={() => setMenuOpen(false)} />
          <div className="sidebar">
            <div className="sidebar-header">
              <h3>Menu</h3>
              <span onClick={() => setMenuOpen(false)}>✖</span>
            </div>
            <input className="sidebar-search" placeholder="Search..." />
            <ul>
              <li onClick={() => { setActiveCategory("all"); setMenuOpen(false); }}>Home</li>
              <li onClick={() => { setActiveCategory("news"); setMenuOpen(false); }}>Breaking News</li>
              <li onClick={() => { setActiveCategory("business"); setMenuOpen(false); }}>Business</li>
              <li onClick={() => { setActiveCategory("culture"); setMenuOpen(false); }}>Culture</li>
              <li onClick={() => { setActiveCategory("music"); setMenuOpen(false); }}>Music</li>
            </ul>
          </div>
        </>
      )}

      {/* MAIN */}
      <main className="container">
        <section className="card">
          <h2>📰 Share local news</h2>
          <input
            placeholder="Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Describe..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={addPost} disabled={!isLoggedIn}>
            Publish
          </button>
          {!isLoggedIn && <p>Please log in to post.</p>}
        </section>

        <h2 className="section">Latest updates</h2>

        {filteredPosts.map((post) => (
          <div className="post" key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <small>
              By {post.author?.fullName || "Unknown"} • {new Date(post.createdAt).toLocaleString()}
            </small>

            <div className="actions">
              <button onClick={() => likePost(post._id)}>
                👍 {post.likes.length}
              </button>
            </div>

            <div className="comments">
              <input
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ""}
                onChange={(e) => {
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }));
                }}
              />
              <button onClick={() => addComment(post._id)}>Send</button>

              {post.comments.map((c) => (
                <div key={c._id} className="comment">
                  <strong>{c.user?.fullName || "Anonymous"}:</strong> {c.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>LocalLens</strong>
            <small>© 2025 Hyperlocal Citizen Journalism</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= ROUTES ================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}