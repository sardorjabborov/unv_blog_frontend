const postsContainer = document.querySelector(".posts");
const menuLinks = document.querySelectorAll(".menu a");
const contactSection = document.querySelector(".contact");

const API_URL = "https://unv-blog-backend.onrender.com";

// --- POSTS NI OLIB RENDER QILISH ---
async function fetchPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();

    postsContainer.innerHTML = "";

    posts.forEach(post => {
      const postEl = document.createElement("article");
      postEl.classList.add("post");
      postEl.innerHTML = `
        <img src="${post.image}" alt="post rasmi">
        <div class="text">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="comments" id="comments-${post._id}"></div>
          <input type="text" id="name-${post._id}" placeholder="Ismingiz">
          <input type="text" id="comment-${post._id}" placeholder="Fikringiz">
          <button onclick="addComment('${post._id}')">Izoh qoldirish</button>
          <p id="thank-${post._id}" style="color:green;"></p>
        </div>
      `;
      postsContainer.appendChild(postEl);
      fetchComments(post._id);
    });
  } catch (err) {
    console.error("Postlarni olishda xato:", err);
  }
}

// --- IZOHLARNI OLISH ---
async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`);
    const comments = await res.json();
    const commentsContainer = document.getElementById(`comments-${postId}`);
    commentsContainer.innerHTML = "";
    comments.forEach(c => {
      const div = document.createElement("div");
      div.textContent = `${c.name}: ${c.comment}`;
      commentsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Izohlarni olishda xato:", err);
  }
}

// --- IZOH QO'SHISH ---
window.addComment = async function(postId) {
  const nameInput = document.getElementById(`name-${postId}`);
  const commentInput = document.getElementById(`comment-${postId}`);
  const thankEl = document.getElementById(`thank-${postId}`);

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (!name || !comment) {
    alert("Iltimos, ism va izohni to‘ldiring");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, comment })
    });
    const data = await res.json();
    thankEl.textContent = data.message;

    nameInput.value = "";
    commentInput.value = "";

    fetchComments(postId); // izohlarni yangilash
  } catch (err) {
    console.error("Izoh qo‘shishda xato:", err);
  }
}

// --- MENU TUGMALARI ---
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const text = link.textContent.trim();

    if (text === "📚 Kategoriyalar" || text === "⭐ Mashhurlar") {
      alert("Bu qism ishlab chiqish jarayonida");
    } else if (text === "✉️ Aloqa") {
      contactSection.style.display = "block";
    } else {
      contactSection.style.display = "none";
    }
  });
});

// --- ALOQA FORMASI YUBORISH ---
const contactSubmit = document.getElementById("contactSubmit");
contactSubmit.addEventListener("click", async () => {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !message) {
    alert("Iltimos, ism va habarni kiriting");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message })
    });
    const data = await res.json();
    alert(data.message);

    document.getElementById("contactName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
  } catch (err) {
    console.error("Aloqa yuborishda xato:", err);
  }
});

// --- SAHIFA YUKLANGANDA ---
fetchPosts();
