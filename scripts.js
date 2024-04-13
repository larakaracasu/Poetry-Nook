let parsedPoems = [];
let headerTimeoutId;  // This will hold the timeout so that it can be cleared if needed

window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            const sortedPoems = sortPoems(parsedPoems);
            populatePoems(sortedPoems);
            typeEffect('typingHeader', ['nook', 'booklet', 'haven']);  // Start typing effect on header
        })
        .catch(error => {
            console.error('There was a problem fetching the poems:', error);
        });
};

function typeEffect(elementId, words) {
    let target = document.getElementById(elementId);
    let currentWord = 0;
    let baseText = "lara's poetry ";  // Static part for the header
    target.innerHTML = baseText;  // Initialize with static part
    let i = 0;
    let direction = 1;

    function typing() {
        if (direction === 1) {  // Typing forward
            if (i < words[currentWord].length) {
                target.innerHTML += words[currentWord].charAt(i);
                i++;
                headerTimeoutId = setTimeout(typing, 150);
            } else {
                headerTimeoutId = setTimeout(typing, 2000);  // Pause before deleting
                direction = -1;
            }
        } else {  // Deleting backward
            if (i > 0) {
                target.innerHTML = baseText + words[currentWord].slice(0, i - 1);
                i--;
                headerTimeoutId = setTimeout(typing, 100);
            } else {
                direction = 1;  // Reset to typing forward
                currentWord = (currentWord + 1) % words.length;  // Cycle to next word
                headerTimeoutId = setTimeout(typing, 500);  // Pause before typing next word
            }
        }
    }

    typing();
}

function parsePoems(data) {
    let poemStrs = data.split("\n\n*").map(poem => poem.trim());
    let poems = poemStrs.map(function(poemStr) {
        let poemLines = poemStr.split("\n");
        let title = poemLines.shift();
        title = title.replace('*', '');
        return { title: title.trim(), lines: poemLines };
    });
    return poems;
}

function sortPoems(poems) {
    return poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
}

function populatePoems(poems) {
    let container = document.getElementById('poemContainer');
    container.innerHTML = '';
    let sentimentAnalyser = new Sentiment();
    
    poems.forEach(function(poem) {
        let gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        // Perform sentiment analysis
        let sentimentResult = sentimentAnalyser.analyze(poem.lines.join('\n'));
        let sentimentScore = sentimentResult.score;

        // Add the event listeners for the hover effect
        gridItem.addEventListener('mouseenter', function() {
            this.style.backgroundColor = sentimentToColor(sentimentScore);
            this.style.transition = 'background-color 1s';
        });
        gridItem.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });

        let title = document.createElement('h2');
        title.innerText = poem.title;
        gridItem.appendChild(title);
        
        let poemText = document.createElement('p');
        poemText.innerText = poem.lines.join('\n');
        gridItem.appendChild(poemText);

        container.appendChild(gridItem);
    });
}

// Function to map sentiment score to a color
function sentimentToColor(sentimentScore) {
    if (sentimentScore > 0) return '#b3ffcc';  // Positive
    if (sentimentScore < 0) return '#ffcccb';  // Negative
    return '#f0f0f0';  // Neutral
}

function searchPoems() {
    let searchQuery = document.getElementById('searchBar').value.toLowerCase();
    let filteredPoems = sortPoems(parsedPoems.filter(poem => 
        poem.title.toLowerCase().includes(searchQuery) || 
        poem.lines.some(line => line.toLowerCase().includes(searchQuery))
    ));
    populatePoems(filteredPoems);
}

function enterSearch(event) {
    if (event.key === 'Enter') {
        searchPoems();
    }
}

function returnToMain() {
    document.getElementById('searchBar').value = '';
    populatePoems(sortPoems(parsedPoems));  // Resets the display to show all poems
}
