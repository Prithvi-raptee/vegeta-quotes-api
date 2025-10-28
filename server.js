/*
 * Daily Vegeta Quote API
 *
 * This is a simple, self-contained Node.js server that serves a single
 * "quote of the day" from a static list.
 *
 * The key design constraint is "a random quote every day."
 * This is achieved not by using Math.random() on each request, but
 * by using the current date to deterministically pick a quote.
 * This ensures every user gets the same quote for a full 24-hour period.
 */

const http = require('http');

// 1. The "Database" of Quotes
// In a real system, this might be in a file or database.
// For this self-contained example, it's a const array.
const VEGETA_QUOTES = [
    "It's over 9000!",
    "Pathetic.",
    "I am the Prince of all Saiyans!",
    "You may have invaded my mind and my body, but there is one thing a Saiyan always keeps: his pride!",
    "Kakarot... you're number one!",
    "There's more to being a warrior than strength alone. There's also... no, wait. It's pretty much just strength.",
    "Push through the pain. Giving up hurts more.",
    "Are you a stupid idiot, or just plain stupid?",
    "That's my Bulma!",
    "He... he actually did it. He's a Super Saiyan...",
    "I do not fear this new challenge. Rather, like a true Saiyan, I will rise to meet it!",
    "Let me ask you. Does a machine like you ever experience fear?",
    "While you were busy crying, I was training.",
    "You're nothing but a worthless, obsolete model!",
    "Struggle all you want, you will never overcome a true elite.",
    "So, this is the power of a god. It's... it's not bad.",
    "Kakarot, you may be the first, but I will be the strongest."
];

/**
 * Helper function to calculate the day of the year (1-366).
 * @param {Date} date - The date object to use.
 * @returns {number} The day of the year.
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Gets the deterministic quote for the given date.
 * @returns {string} The quote of the day.
 */
function getQuoteOfTheDay() {
    const today = new Date();
    const dayIndex = getDayOfYear(today);
    const numQuotes = VEGETA_QUOTES.length;

    // The core logic: Use the day of the year, modulo the number of quotes,
    // to get a consistent index for the entire day.
    const quoteIndex = dayIndex % numQuotes;

    return VEGETA_QUOTES[quoteIndex];
}

// 2. The HTTP Server
const server = http.createServer((req, res) => {
    // We only care about GET requests to the root.
    // In a real API, you'd check req.url and req.method.
    if (req.method === 'GET') {
        const quote = getQuoteOfTheDay();

        // Prepare the JSON response
        const responsePayload = {
            quote: quote,
            character: "Vegeta",
            timestamp: new Date().toISOString()
        };

        // Set headers
        // We include CORS headers (Access-Control-Allow-Origin: *)
        // to allow any webpage to call this API.
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });

        // Send the response
        res.end(JSON.stringify(responsePayload));
    } else {
        // Handle other methods (POST, PUT, etc.) or invalid routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

// 3. Start the Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[Vegeta API]: Running on http://localhost:${PORT}`);
    console.log(`[Vegeta API]: Serving today's quote: "${getQuoteOfTheDay()}"`);
});

