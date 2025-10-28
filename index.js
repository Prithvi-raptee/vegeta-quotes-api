/*
 * Daily Vegeta Quote JSON API
 * Now located at /vegeta-quote-api/json.js
 */

// 1. The "Database" of Quotes (Corrected duplicate declaration)
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

// 2. The Deterministic Logic (Corrected undefined variables)
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function getQuoteOfTheDay() {
    const today = new Date();
    // We adjust for IST (UTC+5:30) to make the "day" change relative to your likely timezone.
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(today.getTime() + istOffset);

    const dayIndex = getDayOfYear(istDate);
    const numQuotes = VEGETA_QUOTES.length;
    const quoteIndex = dayIndex % numQuotes;
    return VEGETA_QUOTES[quoteIndex];
}

// 3. The Vercel Serverless Handler
module.exports = (req, res) => {
    if (req.method === 'GET') {
        const quote = getQuoteOfTheDay();
        const responsePayload = {
            quote: quote,
            character: "Vegeta",
            timestamp: new Date().toISOString()
        };
        
        // Use Vercel's response methods
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(responsePayload);
    } else {
        // Use Vercel's response methods
        res.status(405).json({ error: "Method Not Allowed" });
    }
};
