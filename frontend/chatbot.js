const messages = document.getElementById("chatbot-messages");
const input = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");

let userName = "";

// OPEN CHATBOT
function openChatbot() {
    const bot = document.getElementById("chatbot-container");
    bot.style.display = "flex";

    const openBtn = document.getElementById("chatbot-open-btn");
    openBtn.style.display = "none";
}

// CLOSE CHATBOT
function closeChatbot() {
    const bot = document.getElementById("chatbot-container");
    bot.style.display = "none";

    const openBtn = document.getElementById("chatbot-open-btn");
    openBtn.style.display = "block";
}

// Initial greeting
setTimeout(() => {
    botReply("Hi there! What's your name?");
}, 500);

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
document.getElementById("chatbot-open-btn").addEventListener("click", openChatbot);

function sendMessage() {
    let text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    showTyping();

    setTimeout(() => {
        hideTyping();
        processMessage(text);
    }, calculateDelay(text));
}

function addMessage(text, type) {
    let msg = document.createElement("div");
    msg.classList.add("message", type === "user" ? "user-message" : "bot-message");
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function botReply(text) {
    addMessage(text, "bot");
}

function showTyping() {
    let typing = document.createElement("div");
    typing.id = "typing";
    typing.classList.add("typing");
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
    let typing = document.getElementById("typing");
    if (typing) typing.remove();
}

// Typing delay based on message length
function calculateDelay(text) {
    return Math.min(2000, 500 + text.length * 30);
}

// GOOGLE BOOKS API SEARCH
async function chatbotSearchBooks(query) {

    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            botReply("No books found for '" + query + "'. Try another title.");
            return;
        }

        botReply("Here are some books I found:");

        data.items.slice(0, 5).forEach(book => {
            const info = book.volumeInfo;

            let title = info.title || "No title";
            let authors = info.authors ? info.authors.join(", ") : "Unknown author";
            let thumbnail = info.imageLinks?.thumbnail || "";

            let message = `${title} — by ${authors}`;
            addMessage(message, "bot");

            if (thumbnail) {
                let img = document.createElement("img");
                img.src = thumbnail;
                img.style.width = "80px";
                img.style.margin = "5px 0";
                messages.appendChild(img);
            }
        });

    } catch (error) {
        botReply("There was an error fetching books. Please try again.");
    }
}

// MAIN CHATBOT LOGIC
function processMessage(text) {
    let msg = text.toLowerCase();

    // CLOSE CHATBOT WHEN USER SAYS THANK YOU OR DONE
    if (
        msg.includes("thank you") ||
        msg.includes("thanks") ||
        msg.includes("done") ||
        msg.includes("bye") ||
        msg.includes("goodbye") ||
        msg.includes("that's all") ||
        msg.includes("thats all")
    ) {
        botReply("You're welcome, " + userName + "! Closing the chat.");
        setTimeout(() => closeChatbot(), 1500);
        return;
    }

    // 1. Ask for and store user's name
    if (userName === "") {
        userName = text.trim();
        if (userName.length > 0) {
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
        }
        botReply("Nice to meet you, " + userName + "! I’m your BookNook Assistant. What can I help you with today?");
        return;
    }

    // 2. Greetings
    if (
        msg.includes("hello") ||
        msg.includes("hi") ||
        msg.includes("hey") ||
        msg.includes("salam") ||
        msg.includes("as-salamu") ||
        msg.includes("salaam")
    ) {
        botReply("Hello " + userName + "! How can I help you explore books today?");
        return;
    }

    // 3. CHILDREN’S BOOKS
    if (
        msg.includes("children") ||
        msg.includes("child") ||
        msg.includes("kids") ||
        msg.includes("kid") ||
        msg.includes("baby") ||
        msg.includes("toddler") ||
        msg.includes("preschool")
    ) {
        botReply("Here are some great children's books: The Very Hungry Caterpillar, Goodnight Moon, Brown Bear Brown Bear, The Gruffalo, and Guess How Much I Love You.");
        return;
    }

    // 4. GENRES
    if (
        msg.includes("fantasy") ||
        msg.includes("magic") ||
        msg.includes("dragon") ||
        msg.includes("wizard") ||
        msg.includes("myth")
    ) {
        botReply("Fantasy picks: Harry Potter, Percy Jackson, Shadow and Bone, Eragon, and The Hobbit.");
        return;
    }

    if (
        msg.includes("mystery") ||
        msg.includes("detective") ||
        msg.includes("crime") ||
        msg.includes("whodunit") ||
        msg.includes("investigation")
    ) {
        botReply("Mystery recommendations: Sherlock Holmes, Gone Girl, The Girl with the Dragon Tattoo, and Murder on the Orient Express.");
        return;
    }

    if (
        msg.includes("romance") ||
        msg.includes("love story") ||
        msg.includes("romantic") ||
        msg.includes("relationship")
    ) {
        botReply("Romance reads: The Fault in Our Stars, Me Before You, Pride and Prejudice, and The Notebook.");
        return;
    }

    if (
        msg.includes("sci-fi") ||
        msg.includes("science fiction") ||
        msg.includes("space") ||
        msg.includes("future") ||
        msg.includes("robot") ||
        msg.includes("alien")
    ) {
        botReply("Sci‑Fi suggestions: Dune, Ender's Game, The Hunger Games, and Ready Player One.");
        return;
    }

    if (
        msg.includes("horror") ||
        msg.includes("scary") ||
        msg.includes("spooky") ||
        msg.includes("ghost") ||
        msg.includes("haunted")
    ) {
        botReply("Horror books you might like: IT, Bird Box, The Haunting of Hill House, and The Shining.");
        return;
    }

    // 5. Mood detection
    if (msg.includes("sad")) {
        botReply("I'm sorry you're feeling sad, " + userName + ". Maybe a gentle, heartwarming book would help. Want a recommendation?");
        return;
    }

    if (msg.includes("happy")) {
        botReply("I love that you're feeling happy! Want a fun or exciting book to match your mood?");
        return;
    }

    if (msg.includes("bored")) {
        botReply("Bored? Let's fix that. Tell me a genre you like: fantasy, romance, mystery, sci‑fi, horror, or children's.");
        return;
    }

    // 6. General recommendation request
    if (msg.includes("recommend") || msg.includes("suggest")) {
        botReply("Sure, " + userName + "! Tell me a genre you like — fantasy, romance, mystery, sci‑fi, horror, or children's books.");
        return;
    }

    // 7. SEARCH COMMAND smart detection
    if (
        msg.startsWith("search:") ||
        msg.startsWith("search :") ||
        msg.startsWith("search") ||
        msg.startsWith("find") ||
        msg.startsWith("look up")
    ) {
        let bookName = msg
            .replace("search:", "")
            .replace("search :", "")
            .replace("search", "")
            .replace("find", "")
            .replace("look up", "")
            .trim();

        if (bookName === "") {
            return botReply("Please type it like: search: Harry Potter");
        }

        botReply("Searching for '" + bookName + "'...");
        chatbotSearchBooks(bookName);
        return;
    }

    // 8. Fallback
    botReply("I'm not sure about that, " + userName + ", but I can help you find books! Try typing a genre or use 'search: book name'.");
}
