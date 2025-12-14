import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

type Post = {
  title: string;
  description: string;
  time: string;
  likes: number;
  comments: string[];
  attachments?: { type: "image" | "video" | "link"; src: string }[];
};

export default function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/*" element={<HomeView />} />
    </Routes>
  );
}
