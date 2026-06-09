document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const booksContainer = document.getElementById("books-container");
    const youtubeContainer = document.getElementById("youtube-videos");

    if (!searchBtn || !searchInput || !booksContainer || !youtubeContainer) {
        console.error("Missing required DOM elements");
        return;
    }

    async function searchBooks(query) {
        booksContainer.innerHTML = "<p>Loading books...</p>";
        youtubeContainer.innerHTML = "";

        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
            const data = await res.json();

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

                if (!firstBookTitle && book.title) firstBookTitle = book.title;

                const bookCard = document.createElement("div");
                bookCard.className = "book-card";
                bookCard.innerHTML = `
                    <h3>${book.title || "Untitled"}</h3>
                    <p><strong>Author:</strong> ${book.authors ? book.authors.join(", ") : "Unknown"}</p>
                    <img src="${book.imageLinks?.thumbnail || "frontend/images/default-book.png"}" alt="Book cover">
                    <p>${book.description ? book.description.slice(0, 150) + "..." : "No description available."}</p>
                    <a href="${buyLink}" target="_blank"><button class="buy-btn">Buy Now</button></a>
                `;
                booksContainer.appendChild(bookCard);
            });

            if (firstBookTitle) fetchYouTubeReviews(firstBookTitle);
        } catch (err) {
            console.error(err);
            booksContainer.innerHTML = "<p>Could not load books. Check console.</p>";
        }
    }

    async function fetchYouTubeReviews(bookTitle) {
        youtubeContainer.innerHTML = "<p>Loading YouTube reviews...</p>";
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(bookTitle + " book review")}&type=video&maxResults=5&order=relevance&key=AIzaSyAmAwLIxeHizPyTlw-yOBWk3gbZGbXXqGU`);
            const data = await res.json();
            if (!data.items || data.items.length === 0) {
                youtubeContainer.innerHTML = "<p>No YouTube reviews found.</p>";
                return;
            }
            let output = `<h2>YouTube Book Reviews</h2><div class="video-grid">`;
            data.items.forEach(video => {
                output += `
                    <div class="video-card">
                        <h4>${video.snippet.title}</h4>
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                            <img src="${video.snippet.thumbnails?.medium?.url || "frontend/images/default-video.png"}" alt="thumbnail">
                        </a>
                    </div>`;
            });
            output += `</div>`;
            youtubeContainer.innerHTML = output;
        } catch (err) {
            console.error(err);
            youtubeContainer.innerHTML = "<p>Could not load YouTube reviews.</p>";
        }
    }

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) searchBooks(query);
    });
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) searchBooks(query);
        }
    });

    document.querySelectorAll(".suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.dataset.query;
            if (query) {
                searchInput.value = query;
                searchBooks(query);
            }
        });
    });
});
