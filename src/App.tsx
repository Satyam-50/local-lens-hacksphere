<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> parent of a1aa2a0 (fix: stabilize input handling and update UI structure)
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

<<<<<<< HEAD
  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("All fields are required");
      return;
=======
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [attachments, setAttachments] = useState<{ type: "image" | "video" | "link"; src: string }[]>([]);
  const [linkInput, setLinkInput] = useState("");

  // 👇 per-post comment input fix
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

  /* LOAD / SAVE */
  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPosts(parsed);
      setCommentInputs(new Array(parsed.length).fill(""));
>>>>>>> parent of a1aa2a0 (fix: stabilize input handling and update UI structure)
    }

<<<<<<< HEAD
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
=======
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  /* ACTIONS */
  const addPost = () => {
    if (!title.trim() || !desc.trim()) return;

    const newPost: Post = {
      title,
      description: desc,
      time: new Date().toLocaleString(),
      likes: 0,
      comments: [],
      attachments: attachments.length ? attachments : undefined,
    };

    setPosts([newPost, ...posts]);
    setCommentInputs(["", ...commentInputs]);
    setTitle("");
    setDesc("");
    setAttachments([]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr: { type: "image" | "video" | "link"; src: string }[] = [];
    Array.from(files).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (f.type.startsWith("image")) arr.push({ type: "image", src: result });
        else if (f.type.startsWith("video")) arr.push({ type: "video", src: result });
        else arr.push({ type: "link", src: result });
        // update state once per file added
        setAttachments((prev) => [...prev, ...arr]);
      };
      reader.readAsDataURL(f);
    });
  };

  const addLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    setAttachments((prev) => [...prev, { type: "link", src: url }]);
    setLinkInput("");
  };
>>>>>>> parent of a1aa2a0 (fix: stabilize input handling and update UI structure)

    alert("Signup successful! Please log in.");
    navigate("/login");
  };

<<<<<<< HEAD
=======
  const likePost = (index: number) => {
    const copy = [...posts];
    copy[index].likes += 1;
    setPosts(copy);
  };

  const addComment = (index: number) => {
    const text = commentInputs[index];
    if (!text.trim()) return;

    const copy = [...posts];
    copy[index].comments.push(text);

    const newInputs = [...commentInputs];
    newInputs[index] = "";

    setPosts(copy);
    setCommentInputs(newInputs);
  };

  /* ================= AUTH / HOME VIEWS (routes) ================= */

  function LoginView() {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <button className="auth-back" onClick={() => navigate('/')}>← Back</button>
          <h2>Welcome back</h2>
          <p className="auth-sub">Sign in to LocalLens</p>

          <input aria-label="Email address" type="email" placeholder="Email address" />
          <input aria-label="Password" type="password" placeholder="Password" />

          <button type="button" className="auth-btn" onClick={() => navigate('/')}>Sign in</button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button className="oauth google">Continue with Google</button>
          <button className="oauth github">Continue with GitHub</button>

          <p className="auth-link" onClick={() => navigate('/signup')}>Create a new account →</p>
        </div>
      </div>
    );
  }

  function SignupView() {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <button className="auth-back" onClick={() => navigate('/')}>← Back</button>
          <h2>Create your account</h2>
          <p className="auth-sub">Join hyperlocal journalism</p>

          <input aria-label="Full name" placeholder="Full name" />
          <input aria-label="Email address" type="email" placeholder="Email address" />
          <input aria-label="Password" type="password" placeholder="Password" />

          <button type="button" className="auth-btn" onClick={() => navigate('/')}>Register</button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button className="oauth google">Sign up with Google</button>
          <button className="oauth github">Sign up with GitHub</button>

          <p className="auth-link" onClick={() => navigate('/login')}>Already have an account →</p>
        </div>
      </div>
    );
  }

  function HomeView() {
    return (
      <div className="app">
        {/* TOP BAR */}
        <header className="topbar" role="banner">
          <div className="left">
            <button aria-label="Open menu" className="icon-btn" onClick={() => setMenuOpen(true)}>☰</button>
            <button aria-label="Search" className="icon-btn">🔍</button>
          </div>

          <button className="logo" aria-label="Home" onClick={() => navigate('/')}>LocalLens</button>

          <div className="right">
            <a className="top-link" href="mailto:hello@locallens.example">Contact</a>
            <button className="primary" onClick={() => navigate('/signup')}>Register</button>
            <button className="ghost" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </header>

        {/* NAV */}
        <nav className="nav">
          <span>Home</span>
          <span>News</span>
          <span>Culture</span>
          <span>Business</span>
          <span>Music</span>
          <span className="live">Live</span>
          <span>About</span>
          <span>Privacy</span>
        </nav>

        {/* SIDEBAR */}
        {menuOpen && (
          <div className="sidebar">
            <span className="close" onClick={() => setMenuOpen(false)}>✖</span>
            <input placeholder="Search local news..." />
            <ul>
              <li>Home</li>
              <li>Breaking News</li>
              <li>Business</li>
              <li>Culture</li>
              <li>Sports</li>
              <li>Technology</li>
              <li>Live</li>
            </ul>
          </div>
        )}

        {/* MAIN */}
        <main className="container">
          {/* CREATE POST */}
          <section className="card">
            <h2>📰 Share local news</h2>
            <input
              placeholder="Headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Describe what’s happening in your area..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="attachments-row">
              <label className="file-btn">
                Add media
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  hidden
                />
              </label>

              <div className="link-input">
                <input
                  placeholder="Paste image/video URL or webpage link"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                />
                <button type="button" onClick={addLink}>Add</button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="attachment-preview">
                {attachments.map((a, i) => (
                  <div className="attachment" key={i}>
                    {a.type === "image" && <img src={a.src} alt={`attachment-${i}`} />}
                    {a.type === "video" && (
                      <video src={a.src} controls preload="metadata" />
                    )}
                    {a.type === "link" && (
                      <a href={a.src} target="_blank" rel="noreferrer">{a.src}</a>
                    )}
                    <button className="remove-attach" onClick={() => removeAttachment(i)}>✖</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={addPost}>Publish</button>
          </section>

          <h2 className="section">Latest updates</h2>

          {/* FEED */}
          {posts.length === 0 && <p>No news yet. Be the first to post!</p>}

          {posts.map((post, index) => (
            <div className="post" key={index}>
              <h3>🗞️ {post.title}</h3>
              <p>{post.description}</p>
              <small>{post.time}</small>

              <div className="actions">
                <button onClick={() => likePost(index)}>👍 {post.likes}</button>
                <button>🔁 Repost</button>
                <button>📤 Share</button>
              </div>

              <div className="comments">
                <input
                  placeholder="Write a comment..."
                  value={commentInputs[index] || ""}
                  onChange={(e) => {
                    const copy = [...commentInputs];
                    copy[index] = e.target.value;
                    setCommentInputs(copy);
                  }}
                />
                <button onClick={() => addComment(index)}>Send</button>

                {post.comments.map((c, i) => (
                  <div key={i} className="comment">💬 {c}</div>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* FOOTER */}
        <footer>
          <div className="footer-inner">
            <div className="footer-brand">
              <button className="logo" aria-label="Home" onClick={() => navigate('/')}>LocalLens</button>
              <small>© 2025 LocalLens · Hyperlocal Citizen Journalism</small>
            </div>

            <nav className="footer-links" aria-label="Footer links">
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </nav>

            <div className="footer-social" aria-label="Social links">
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📸</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

>>>>>>> parent of a1aa2a0 (fix: stabilize input handling and update UI structure)
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