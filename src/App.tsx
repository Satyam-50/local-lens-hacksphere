import { useEffect, useState, useCallback } from "react";
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
  const [attachments, setAttachments] = useState<{ type: "image" | "video" | "link"; src: string }[]>([]);
  const [linkInput, setLinkInput] = useState("");

  // 👇 per-post comment input fix
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

  // Controlled inputs: `title`, `desc`, `linkInput`, and `commentInputs`
  // are React state sources of truth. We bind `value` to state and
  // update via `onChange` handlers using `e.currentTarget.value` so
  // the user can type continuously without losing focus.

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
  // Update headline (controlled input)
  // NOTE: We'll use direct onChange handlers in JSX (e.target.value)
  // to ensure simple, predictable behavior for controlled inputs.

  // Create a new post. Use functional updates to avoid races with
  // concurrent state changes and keep state reset logic local to this
  // action (doesn't reset during normal renders).
  const addPost = useCallback(() => {
    if (!title.trim() || !desc.trim()) return;

    const newPost: Post = {
      title,
      description: desc,
      time: new Date().toLocaleString(),
      likes: 0,
      comments: [],
      attachments: attachments.length ? attachments : undefined,
    };

    setPosts((prev) => [newPost, ...prev]);
    setCommentInputs((prev) => ["", ...prev]);
    setTitle("");
    setDesc("");
    setAttachments([]);
  }, [title, desc, attachments]);

  // Read files and append attachments one-by-one. Each attachment is
  // added via functional `setAttachments` to avoid replacing state on
  // each file read and triggering unexpected re-renders.
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const item: { type: "image" | "video" | "link"; src: string } = f.type.startsWith("image")
          ? { type: "image", src: result }
          : f.type.startsWith("video")
            ? { type: "video", src: result }
            : { type: "link", src: result };
        setAttachments((prev) => [...prev, item]);
      };
      reader.readAsDataURL(f);
    });
  }, []);

  // Add a URL as an attachment and clear the inline link input.
  const addLink = useCallback(() => {
    const url = linkInput.trim();
    if (!url) return;
    setAttachments((prev) => [...prev, { type: "link", src: url }]);
    setLinkInput("");
  }, [linkInput]);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const likePost = (index: number) => {
    const copy = [...posts];
    copy[index].likes += 1;
    setPosts(copy);
  };

  // Append a comment to a post. We read the comment text from
  // `commentInputs[index]` and use functional updates to avoid
  // stepping on concurrent state updates.
  const addComment = useCallback((index: number) => {
    const text = commentInputs[index];
    if (!text?.trim()) return;

    setPosts((prev) => {
      const copy = [...prev];
      const target = copy[index];
      copy[index] = { ...target, comments: [...target.comments, text] };
      return copy;
    });

    setCommentInputs((prev) => {
      const copy = [...prev];
      copy[index] = "";
      return copy;
    });
  }, [commentInputs]);

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
              onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            />
            <textarea
              placeholder="Describe what’s happening in your area..."
              value={desc}
              onChange={(e) => setDesc((e.target as HTMLTextAreaElement).value)}
            />
            <div className="attachments-row">
              <label className="file-btn">
                Add media
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleFiles(e.currentTarget.files)}
                  hidden
                />
              </label>

              <div className="link-input">
                <input
                  placeholder="Paste image/video URL or webpage link"
                  value={linkInput}
                  onChange={(e) => setLinkInput((e.target as HTMLInputElement).value)}
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

            <button onClick={addPost} disabled={!title.trim() || !desc.trim()}>Publish</button>
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
                  onChange={(e) => setCommentInputs((prev) => {
                    const copy = [...prev];
                    copy[index] = (e.target as HTMLInputElement).value;
                    return copy;
                  })}
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

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/*" element={<HomeView />} />
    </Routes>
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
