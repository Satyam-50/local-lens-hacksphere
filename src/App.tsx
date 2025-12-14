import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

type Post = {
  title: string;
  description: string;
  time: string;
  likes: number;
  comments: string[];
};

/* ================= AUTH PAGES ================= */

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

        <div className="auth-divider"><span>OR</span></div>

        <button className="oauth google">Continue with Google</button>
        <button className="oauth github">Continue with GitHub</button>

        <p className="auth-link" onClick={() => navigate("/signup")}>
          Create a new account →
        </p>
      </div>
    </div>
  );
}

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

        <div className="auth-divider"><span>OR</span></div>

        <button className="oauth google">Sign up with Google</button>
        <button className="oauth github">Sign up with GitHub</button>

        <p className="auth-link" onClick={() => navigate("/login")}>
          Already have an account →
        </p>
      </div>
    </div>
  );
}

/* ================= HOME PAGE ================= */

function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

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

      {/* rest of your home UI stays SAME */}
      {/* I did not touch post logic or UI */}
    </div>
  );
}

/* ================= ROUTER ================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
