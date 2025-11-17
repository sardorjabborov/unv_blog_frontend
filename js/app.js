const postsContainer = document.querySelector(".posts");
const API_URL = "https://unv-blog-backend.onrender.com/api/posts";

// Postlarni olish va render qilish
async function fetchPosts() {
  const res = await fetch(API_URL);
  const posts = await res.json();
  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="comments" id="comments-${post._id}"></div>
      <input type="text" id="name-${post._id}" placeholder="Ismingiz">
      <input type="text" id="comment-${post._id}" placeholder="Fikringiz">
      <button onclick="addComment('${post._id}')">Izoh qoldirish</button>
    `;
    postsContainer.appendChild(postEl);
    fetchComments(post._id);
  });
}

// Izohlarni olish
async function fetchComments(postId) {
  const res = await fetch(`${API_URL}/${postId}/comments`);
  const comments = await res.json();
  const container = document.getElementById(`comments-${postId}`);
  container.innerHTML = "";
  comments.forEach(c => {
    const div = document.createElement("div");
    div.textContent = `${c.name}: ${c.comment}`;
    container.appendChild(div);
  });
}

// Izoh qo'shish
window.addComment = async function(postId) {
  const name = document.getElementById(`name-${postId}`).value.trim();
  const comment = document.getElementById(`comment-${postId}`).value.trim();
  if(!name || !comment) return alert("Iltimos, ism va izoh kiriting");

  await fetch(`${API_URL}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, comment })
  });

  document.getElementById(`name-${postId}`).value = "";
  document.getElementById(`comment-${postId}`).value = "";
  fetchComments(postId);
}

// Sahifa yuklanganda
fetchPosts();
