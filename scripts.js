let parsedPoems = [];
let headerTimeoutId;  // For managing the typing effect timeout

// Function to load poems and initialize effects upon window load
window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            populatePoems(sortPoems(parsedPoems));
            typeEffect('typingHeader', ['nook', 'booklet', 'haven']);
        })
        .catch(error => {
            console.error('There was a problem fetching the poems:', error);
        });
};

// Function to parse poem data
function parsePoems(data) {
    return data.split("\n\n*").map(poem => {
        let lines = poem.trim().split("\n");
        let title = lines.shift().replace('*', '').trim();
        return { title, lines };
    });
}

// Function to sort poems
function sortPoems(poems) {
    return poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
}

// Function to populate poems with dynamic mood-based coloring
function populatePoems(poems) {
    let container = document.getElementById('poemContainer');
    container.innerHTML = '';
    const sentimentAnalyser = new Sentiment();

    poems.forEach(poem => {
        let gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        let sentimentResult = sentimentAnalyser.analyze(poem.lines.join('\n'));
        let sentimentScore = sentimentResult.score;
        gridItem.dataset.sentiment = sentimentScore;

        let title = document.createElement('h2');
        title.innerText = poem.title;
        let poemText = document.createElement('p');
        poemText.innerText = poem.lines.join('\n');

        gridItem.appendChild(title);
        gridItem.appendChild(poemText);
        container.appendChild(gridItem);
    });
}

// Typing effect function
function typeEffect(elementId, words) {
    let target = document.getElementById(elementId);
    let i = 0, currentWord = 0, direction = 1;
    target.innerHTML = "lara's poetry ";  // Initialize with static part

    function typing() {
        if (direction === 1 && i < words[currentWord].length) {
            target.innerHTML += words[currentWord].charAt(i++);
            setTimeout(typing, 150);
        } else if (direction === -1 && i > 0) {
            target.innerHTML = target.innerHTML.slice(0, -1);
            i--;
            setTimeout(typing, 100);
        } else if (i <= 0) {
            direction = 1;
            currentWord = (currentWord + 1) % words.length;
            setTimeout(typing, 500);
        } else {
            direction = -1;
            setTimeout(typing, 2000);
        }
    }
    typing();
}
