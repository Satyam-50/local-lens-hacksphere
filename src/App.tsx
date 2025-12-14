import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

/* ================= TYPES ================= */

type Post = {
  title: string;
  description: string;
  time: string;
  likes: number;
  comments: string[];
};

/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to LocalLens</p>

        <input type="email" placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <button className="auth-btn" onClick={() => navigate("/")}>
          Sign in
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="oauth google">Continue with Google</button>
        <button className="oauth github">Continue with GitHub</button>

        <p className="auth-link" onClick={() => navigate("/signup")}>
          Create a new account →
        </p>
      </div>
    </div>
  );
}

/* ================= SIGNUP ================= */

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-sub">Join hyperlocal journalism</p>

        <input placeholder="Full name" />
        <input type="email" placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <button className="auth-btn" onClick={() => navigate("/")}>
          Register
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="oauth google">Sign up with Google</button>
        <button className="oauth github">Sign up with GitHub</button>

        <p className="auth-link" onClick={() => navigate("/login")}>
          Already have an account →
        </p>
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

  /* LOAD / SAVE */
  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPosts(parsed);
      setCommentInputs(new Array(parsed.length).fill(""));
    }
  }, []);

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
    };

    setPosts([newPost, ...posts]);
    setCommentInputs(["", ...commentInputs]);
    setTitle("");
    setDesc("");
  };

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

  return (
    <div className="app">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="left">
          <span onClick={() => setMenuOpen(true)}>☰</span>
          <span>🔍</span>
        </div>

        <div className="logo">LocalLens</div>

        <div className="right">
          <button onClick={() => navigate("/signup")}>Register</button>
          <button onClick={() => navigate("/login")}>Sign in</button>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav">
        <span>Home</span>
        <span>News</span>
        <span>Culture</span>
        <span>Business</span>
        <span>Music</span>
        <span>Live</span>
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
          <button onClick={addPost}>Publish</button>
        </section>

        <h2 className="section">Latest updates</h2>

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

      <footer>
        <p>© 2025 LocalLens · Hyperlocal Citizen Journalism</p>
      </footer>
    </div>
  );
}

/* ================= ROUTES ================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
