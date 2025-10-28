/*
 * Daily Vegeta Quote SVG Endpoint
 * Located at /vegeta-quotes-api/quote-svg.js
 */

// 1. The "Database" of Quotes (Must be kept in sync with json.js)
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

// 2. The Deterministic Logic
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

/**
 * Wraps text to a given width.
 * @param {string} text - The text to wrap.
 * @param {number} maxWidth - The max width (in chars, approx) per line.
 * @returns {string[]} An array of strings, one for each line.
 */
function wrapText(text, maxWidth = 55) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    lines.push(currentLine.trim()); // Add the last line
    return lines;
}

// 3. The Vercel Serverless Handler
module.exports = (req, res) => {
    try {
        const quote = getQuoteOfTheDay();
        const quoteLines = wrapText(quote);

        // Dynamically build <text> elements for each line
        let lineY = 45;
        const lineSpacing = 22;
        const tspanElements = quoteLines.map((line, index) => {
            const y = lineY + (index * lineSpacing);
            return `<tspan x="20" y="${y}">${line}</tspan>`;
        }).join('');

        // Dynamically calculate card height
        const cardHeight = 80 + (quoteLines.length - 1) * lineSpacing + 20; // Base + lines + padding

        // 4. The SVG Template
        const svg = `
            <svg width="450" height="${cardHeight}" viewBox="0 0 450 ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .quote {
                        font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
                        fill: #9f9f9f; /* Lighter text for quote */
                        font-style: italic;
                    }
                    .author {
                        font: 700 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
                        fill: #7f7f7f; /* Darker text for author */
                        text-anchor: end;
                    }
                </style>
                
                <rect width="100%" height="100%" rx="8" fill="#1c1c1c" stroke="#333" stroke-width="1"/>
                
                <text class="quote">
                    ${tspanElements}
                </text>
                
                <text class="author" x="430" y="${cardHeight - 25}">
                    ~ Vegeta
                </text>
            </svg>
        `;

        // Set headers
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        // Send the response
        res.status(200).send(svg);

    } catch (error) {
        res.status(500).send("Error generating quote SVG");
    }
};
