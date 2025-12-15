import { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./login";

/* ================= TYPES ================= */

type Category = "all" | "news" | "culture" | "business" | "music";

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
  category: Exclude<Category, "all">;
  attachments?: Attachment[];
};

/* ================= DUMMY POSTS ================= */

const DUMMY_POSTS: Post[] = [
  {
    title: "Local Art Fair Brings Community Together",
    description: "Artists showcased paintings, pottery, and live sketches.",
    time: "Today · 10:30 AM",
    likes: 12,
    comments: [],
    category: "culture",
  },
  {
    title: "Street Music Festival Lights Up Downtown",
    description: "Independent bands drew hundreds of music lovers.",
    time: "Yesterday · 7:00 PM",
    likes: 18,
    comments: [],
    category: "music",
  },
  {
    title: "Small Businesses See Growth This Quarter",
    description: "Local shops report higher sales this quarter.",
    time: "Yesterday · 2:15 PM",
    likes: 9,
    comments: [],
    category: "business",
  },
  {
    title: "Heritage Walk Explores Old City Stories",
    description: "Residents rediscovered historic landmarks.",
    time: "2 days ago",
    likes: 14,
    comments: [],
    category: "culture",
  },
  {
    title: "Indie Music Scene Thriving Among Youth",
    description: "College bands perform weekly at cafés.",
    time: "3 days ago",
    likes: 22,
    comments: [],
    category: "music",
  },
  {
    title: "Local Startup Raises Seed Funding",
    description: "A homegrown startup secures early funding.",
    time: "3 days ago",
    likes: 30,
    comments: [],
    category: "business",
  },
  {
    title: "City Council Discusses Traffic Reforms",
    description: "New proposals aim to reduce congestion.",
    time: "4 days ago",
    likes: 6,
    comments: [],
    category: "news",
  },
];

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

        <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="auth-btn" onClick={handleSignup}>Register</button>
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [commentInputs, setCommentInputs] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const token = localStorage.getItem("token");
  const isLoggedIn = token && token !== "null" && token !== "undefined";

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const addPost = useCallback(() => {
    if (!isLoggedIn) {
      alert("Login required to post");
      return;
    }
    if (!title.trim() || !desc.trim()) return;

    const newPost: Post = {
      title,
      description: desc,
      time: new Date().toLocaleString(),
      likes: 0,
      comments: [],
      category: "news",
    };

    setPosts((prev) => [newPost, ...prev]);
    setCommentInputs((prev) => ["", ...prev]);
    setTitle("");
    setDesc("");
  }, [title, desc, isLoggedIn]);

  const likePost = (index: number) => {
    const copy = [...posts];
    copy[index].likes += 1;
    setPosts(copy);
  };

  const addComment = (index: number) => {
    if (!isLoggedIn) {
      alert("Login required to comment");
      return;
    }

    const text = commentInputs[index];
    if (!text?.trim()) return;

    setPosts((prev) => {
      const copy = [...prev];
      copy[index].comments.push(text);
      return copy;
    });

    setCommentInputs((prev) => {
      const copy = [...prev];
      copy[index] = "";
      return copy;
    });
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
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/signup")}>Register</button>
              <button onClick={() => navigate("/login")}>Sign in</button>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
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
        <div className="sidebar">
          <span className="close" onClick={() => setMenuOpen(false)}>✖</span>
          <ul>
            <li>Home</li>
            <li>Breaking News</li>
            <li>Business</li>
            <li>Culture</li>
            <li>Music</li>
          </ul>
        </div>
      )}

      {/* MAIN */}
      <main className="container">
        <section className="card">
          <h2>📰 Share local news</h2>
          <input placeholder="Headline" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Describe..." value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button onClick={addPost} disabled={!isLoggedIn}>Publish</button>
          {!isLoggedIn && <p>Please log in to post.</p>}
        </section>

        <h2 className="section">Latest updates</h2>

        {filteredPosts.map((post) => {
          const index = posts.indexOf(post);
          return (
            <div className="post" key={index}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <small>{post.time}</small>

              <div className="actions">
                <button onClick={() => likePost(index)}>👍 {post.likes}</button>
              </div>

              {activeCategory === "all" && (
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
                    <div key={i}>💬 {c}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
