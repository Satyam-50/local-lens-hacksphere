const postBtn = document.getElementById("postBtn");
const postsDiv = document.getElementById("posts");

postBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) return;

  const post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <h3>${title}</h3>
    <p>${content}</p>
    <small>Just now</small>

    <div class="actions">
      <button class="like">❤️ Like</button>
      <button class="commentBtn">💬 Comment</button>
    </div>

    <div class="comments">
      <input type="text" placeholder="Write a comment..." />
      <button>Add</button>
      <div class="comment-list"></div>
    </div>
  `;

  postsDiv.prepend(post);

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";

  // comment logic
  const addBtn = post.querySelector(".comments button");
  const input = post.querySelector(".comments input");
  const list = post.querySelector(".comment-list");

  addBtn.onclick = () => {
    if (!input.value.trim()) return;
    const c = document.createElement("div");
    c.className = "comment";
    c.innerHTML = `<strong>You:</strong> ${input.value}`;
    list.appendChild(c);
    input.value = "";
  };
});


// ===== SIDEBAR =====
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeSidebar = document.getElementById("closeSidebar");

menuBtn.onclick = () => {
  sidebar.hidden = false;
  overlay.hidden = false;
};

closeSidebar.onclick = overlay.onclick = () => {
  sidebar.hidden = true;
  overlay.hidden = true;
};
