import { useEffect, useState } from "react";
import "./App.css";

type Post = {
  title: string;
  description: string;
  time: string;
  likes: number;
  comments: string[];
};

export default function App() {
  const [page, setPage] = useState<"home" | "login" | "signup">("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [comment, setComment] = useState("");

  /* LOAD / SAVE */
  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  /* ACTIONS */
  const addPost = () => {
    if (!title || !desc) return;
    setPosts([
      {
        title,
        description: desc,
        time: new Date().toLocaleString(),
        likes: 0,
        comments: [],
      },
      ...posts,
    ]);
    setTitle("");
    setDesc("");
  };

  const likePost = (i: number) => {
    const copy = [...posts];
    copy[i].likes++;
    setPosts(copy);
  };

  const addComment = (i: number) => {
    if (!comment) return;
    const copy = [...posts];
    copy[i].comments.push(comment);
    setPosts(copy);
    setComment("");
  };

  /* ================= AUTH PAGES ================= */

  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Sign in</h2>
          <input placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button onClick={() => setPage("home")}>Sign in</button>
          <p onClick={() => setPage("signup")}>Create account</p>
        </div>
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Register</h2>
          <input placeholder="Name" />
          <input placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button onClick={() => setPage("home")}>Register</button>
          <p onClick={() => setPage("login")}>Already have an account</p>
        </div>
      </div>
    );
  }

  /* ================= HOME ================= */

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
          <button onClick={() => setPage("signup")}>Register</button>
          <button onClick={() => setPage("login")}>Sign in</button>
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
          <input placeholder="Search news..." />
          <ul>
            <li>Home</li>
            <li>News</li>
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
          <h2>Share local news</h2>
          <input
            placeholder="Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="What's happening?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={addPost}>Publish</button>
        </section>

        <h2 className="section">Latest updates</h2>

        {posts.map((p, i) => (
          <div className="post" key={i}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <small>{p.time}</small>

            <div className="actions">
              <button onClick={() => likePost(i)}>👍 {p.likes}</button>
              <button>🔁 Repost</button>
              <button>📤 Share</button>
            </div>

            <div className="comments">
              <input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={() => addComment(i)}>Send</button>

              {p.comments.map((c, idx) => (
                <div key={idx} className="comment">💬 {c}</div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>Text only</span>
        </div>
        <p>© 2025 LocalLens</p>
      </footer>
    </div>
  );
}
