const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const booksContainer = document.getElementById("books-container");
const youtubeContainer = document.getElementById("youtube-videos");

// 🔑 PUT YOUR YOUTUBE API KEY HERE
const YOUTUBE_API_KEY = "AIzaSyByLFGyi1jD8KE1S2wHoskBXMfHYhQbCNU";

// -------------------------
// 📚 BOOKS (OPEN LIBRARY)
// -------------------------
function searchBooks(query) {
  if (!booksContainer || !youtubeContainer) return;

  booksContainer.innerHTML = "<p>Loading books...</p>";
  youtubeContainer.innerHTML = "";

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Books:", data);

      if (!data.docs || data.docs.length === 0) {
        booksContainer.innerHTML = "<p>No books found.</p>";
        return;
      }

      booksContainer.innerHTML = "";
      let firstBookTitle = "";

      data.docs.slice(0, 10).forEach(book => {
        if (!firstBookTitle && book.title) {
          firstBookTitle = book.title;
        }

        const cover = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : "images/default-book.png";

        const author = book.author_name?.join(", ") || "Unknown";

        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        bookCard.innerHTML = `
          <h3>${book.title || "Untitled"}</h3>
          <p><strong>Author:</strong> ${author}</p>
          <img src="${cover}" alt="Book cover">
        `;

        booksContainer.appendChild(bookCard);
      });

      if (firstBookTitle) {
        fetchYouTubeReviews(firstBookTitle);
      }
    })
    .catch(err => {
      console.error("Books Error:", err);
      booksContainer.innerHTML = "<p>Error loading books.</p>";
    });
}

// -------------------------
// 🎥 YOUTUBE REVIEWS
// -------------------------
function fetchYouTubeReviews(bookTitle) {
  const API_KEY = YOUTUBE_API_KEY;

  if (!API_KEY) {
    youtubeContainer.innerHTML =
      "<p>Please add your YouTube API key.</p>";
    return;
  }

  youtubeContainer.innerHTML = "<p>Loading YouTube reviews...</p>";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    bookTitle + " book review"
  )}&type=video&maxResults=5&order=relevance&key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("YouTube:", data);

      if (data.error) {
        youtubeContainer.innerHTML =
          "<p>YouTube API error. Check your key.</p>";
        return;
      }

      if (!data.items || data.items.length === 0) {
        youtubeContainer.innerHTML =
          "<p>No YouTube videos found.</p>";
        return;
      }

      let output = `
        <h2>YouTube Book Reviews</h2>
        <div class="video-grid">
      `;

      data.items.forEach(video => {
        output += `
          <div class="video-card">
            <h4>${video.snippet.title}</h4>
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
              <img src="${video.snippet.thumbnails?.medium?.url}" alt="video">
            </a>
          </div>
        `;
      });

      output += "</div>";
      youtubeContainer.innerHTML = output;
    })
    .catch(err => {
      console.error("YouTube Error:", err);
      youtubeContainer.innerHTML = "<p>Error loading videos.</p>";
    });
}

// -------------------------
// 🔘 EVENTS
// -------------------------
searchBtn?.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;
  searchBooks(query);
});

searchInput?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;
    searchBooks(query);
  }
});

// Genre buttons
document.querySelectorAll(".genre-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const genre = btn.dataset.genre;
    searchInput.value = genre;
    searchBooks(genre);
  });
});

// Suggestions
document.querySelectorAll(".suggestion-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const query = btn.dataset.query;
    searchInput.value = query;
    searchBooks(query);
  });
});

// Header scroll effect
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 50);
});
