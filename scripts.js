let parsedPoems = [];

window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            const sortedPoems = sortPoems(parsedPoems);
            populatePoems(sortedPoems);
            typeEffect();
        })
        .catch(error => {
            console.error('There was a problem fetching the poems:', error);
        });
};

function parsePoems(data) {
    var poemStrs = data.split("\n\n*").map(poem => poem.trim());
    var poems = poemStrs.map(function(poemStr) {
        var poemLines = poemStr.split("\n");
        var title = poemLines.shift();
        title = title.replace('*', '');
        return { title: title.trim(), lines: poemLines };
    });
    return poems;
}

function sortPoems(poems) {
    return poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
}

function populatePoems(poems) {
    var container = document.getElementById('poemContainer');
    container.innerHTML = '';
    poems.forEach(function(poem) {
        var gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        var title = document.createElement('h2');
        title.innerText = poem.title;
        gridItem.appendChild(title);
        var poemText = document.createElement('p');
        poemText.innerText = poem.lines.join('\n');
        gridItem.appendChild(poemText);
        container.appendChild(gridItem);
    });
}

function searchPoems() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const filteredPoems = sortPoems(parsedPoems.filter(poem => 
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
    populatePoems(sortPoems(parsedPoems));
}

let cycleWords = ['nook', 'booklet', 'haven'];  // Words to cycle through
let currentWord = 0;  // Index of the current word in the cycle

function typeEffect() {
    let header = document.getElementById('typingHeader');
    let baseText = "lara's poetry ";  // The static part of the header
    header.innerHTML = baseText;  // Initialize header with the static part
    let i = 0;  // Initialize index for character position in the current word
    let direction = 1;  // Direction of typing: 1 for typing, -1 for deleting

    function typing() {
        if (direction === 1) {  // Typing the word
            if (i < cycleWords[currentWord].length) {
                header.innerHTML += cycleWords[currentWord].charAt(i);
                i++;
                setTimeout(typing, 150);  // Typing speed
            } else {
                setTimeout(typing, 2000);  // Pause at the end before deleting
                direction = -1;  // Change direction to deleting
            }
        } else {  // Deleting the word
            if (i > 0) {
                header.innerHTML = baseText + cycleWords[currentWord].slice(0, i - 1);
                i--;
                setTimeout(typing, 100);  // Deleting speed
            } else {
                direction = 1;  // Change direction to typing
                currentWord = (currentWord + 1) % cycleWords.length;  // Move to the next word
                setTimeout(typing, 500);  // Pause before starting to type the next word
            }
        }
    }

    typing();  // Start the typing effect
}
}
