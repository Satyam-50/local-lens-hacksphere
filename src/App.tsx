import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./login";

/* ================= TYPES ================= */

type Attachment = {
  type: "image" | "video" | "link";
  src: string;
};

type Post = {
  title: string;
  description: string;
  time: string;
  likes: number;
  comments: string[];
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

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate("/")}>← Back</button>
        <h2>Create your account</h2>

        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email address"
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
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

  const isLoggedIn = !!localStorage.getItem("token");

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
    if (!isLoggedIn) {
      alert("Please log in to post");
      return;
    }
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

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (file.type.startsWith("image"))
          setAttachments((p) => [...p, { type: "image", src }]);
        else if (file.type.startsWith("video"))
          setAttachments((p) => [...p, { type: "video", src }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    setAttachments((p) => [...p, { type: "link", src: linkInput }]);
    setLinkInput("");
  };

  const removeAttachment = (i: number) => {
    setAttachments((p) => p.filter((_, idx) => idx !== i));
  };

  const likePost = (i: number) => {
    const copy = [...posts];
    copy[i].likes++;
    setPosts(copy);
  };

  const addComment = (i: number) => {
    if (!isLoggedIn) {
      alert("Login required to comment");
      return;
    }
    const text = commentInputs[i];
    if (!text.trim()) return;

    const copy = [...posts];
    copy[i].comments.push(text);

    const newInputs = [...commentInputs];
    newInputs[i] = "";

    setPosts(copy);
    setCommentInputs(newInputs);
  };

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="left">
          <button onClick={() => setMenuOpen(true)}>☰</button>
          <button>🔍</button>
        </div>

        <button className="logo" onClick={() => navigate("/")}>LocalLens</button>

        <div className="right">
          {!isLoggedIn && (
            <>
              <button onClick={() => navigate("/signup")}>Register</button>
              <button onClick={() => navigate("/login")}>Sign in</button>
            </>
          )}
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

          <input placeholder="Headline" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Describe what’s happening..." value={desc} onChange={(e) => setDesc(e.target.value)} />

          <div className="attachments-row">
            <label className="file-btn">
              Add media
              <input type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            </label>

            <input
              placeholder="Paste link"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
            />
            <button onClick={addLink}>Add</button>
          </div>

          {attachments.length > 0 && (
            <div className="attachment-preview">
              {attachments.map((a, i) => (
                <div key={i}>
                  {a.type === "image" && <img src={a.src} />}
                  {a.type === "video" && <video src={a.src} controls />}
                  {a.type === "link" && <a href={a.src}>{a.src}</a>}
                  <button onClick={() => removeAttachment(i)}>✖</button>
                </div>
              ))}
            </div>
          )}

          <button onClick={addPost} disabled={!isLoggedIn}>
            Publish
          </button>
          {!isLoggedIn && <p>Please log in to post.</p>}
        </section>

        <h2 className="section">Latest updates</h2>

        {posts.map((post, i) => (
          <div className="post" key={i}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <small>{post.time}</small>

            <div className="actions">
              <button onClick={() => likePost(i)}>👍 {post.likes}</button>
            </div>

            <div className="comments">
              <input
                placeholder="Write a comment..."
                value={commentInputs[i] || ""}
                onChange={(e) => {
                  const c = [...commentInputs];
                  c[i] = e.target.value;
                  setCommentInputs(c);
                }}
              />
              <button onClick={() => addComment(i)}>Send</button>

              {post.comments.map((c, j) => (
                <div key={j}>💬 {c}</div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer>
        <small>© 2025 LocalLens · Hyperlocal Citizen Journalism</small>
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
