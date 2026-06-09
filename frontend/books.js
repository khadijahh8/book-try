// --- ELEMENTS ---
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const booksContainer = document.getElementById("books-container");
const youtubeContainer = document.getElementById("youtube-videos");

// --- SEARCH FUNCTION ---
function searchBooks(query) {
  booksContainer.innerHTML = "<p>Loading books...</p>";
  youtubeContainer.innerHTML = "";

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        booksContainer.innerHTML = "<p>No books found.</p>";
        return;
      }

      booksContainer.innerHTML = "";
      let firstBookTitle = "";

      data.items.forEach(item => {
        const book = item.volumeInfo;
        const saleInfo = item.saleInfo || {};
        const buyLink = saleInfo.buyLink || book.infoLink || "#";

        if (!firstBookTitle && book.title) {
          firstBookTitle = book.title;
        }

        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        bookCard.innerHTML = `
          <h3>${book.title || "Untitled"}</h3>
          <p><strong>Author:</strong> ${book.authors ? book.authors.join(", ") : "Unknown"}</p>
          <img src="${book.imageLinks?.thumbnail || "images/default-book.png"}" alt="Book cover">
          <p>${book.description ? book.description.slice(0, 150) + "..." : "No description available."}</p>
          <a href="${buyLink}" target="_blank">
            <button class="buy-btn">Buy Now</button>
          </a>
        `;

        booksContainer.appendChild(bookCard);
      });

      // Load YouTube reviews for first book
      if (firstBookTitle) {
        fetchYouTubeReviews(firstBookTitle);
      }
    })
    .catch(err => {
      console.error(err);
      booksContainer.innerHTML = "<p>Could not load books.</p>";
    });
}

// --- YOUTUBE REVIEWS ---
function fetchYouTubeReviews(bookTitle) {
  const API_KEY = "AIzaSyAmAwLIxeHizPyTlw-yOBWk3gbZGbXXqGU";

  youtubeContainer.innerHTML = "<h3>Loading YouTube reviews...</h3>";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    bookTitle + " book review"
  )}&type=video&maxResults=5&order=relevance&key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        youtubeContainer.innerHTML = "<p>No YouTube reviews found for this book.</p>";
        return;
      }

      // Start output with heading + grid wrapper
      let output = `
        <h2>YouTube Book Reviews</h2>
        <div class="video-grid">
      `;

      data.items.forEach(video => {
        output += `
          <div class="video-card">
            <h4>${video.snippet.title}</h4>
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
              <img src="${video.snippet.thumbnails?.medium?.url || "images/default-video.png"}" 
                   alt="video thumbnail">
            </a>
          </div>
        `;
      });

      // Close the grid wrapper
      output += "</div>";

      youtubeContainer.innerHTML = output;
    })
    .catch(err => {
      console.error(err);
      youtubeContainer.innerHTML = "<p>Could not load YouTube reviews.</p>";
    });
}


// --- EVENT LISTENERS ---

// Search button
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;
  searchBooks(query);
});

// Enter key support
searchInput.addEventListener("keypress", (e) => {
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
    searchBooks(`subject:${genre}`);
  });
});

// Suggestion buttons
const suggestionBtns = document.querySelectorAll(".suggestion-btn");
suggestionBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const query = btn.dataset.query;
    searchInput.value = query;
    searchBooks(query);
  });
});



  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


