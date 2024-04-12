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

let cycleWords = ['nook', 'booklet', 'haven'];
let currentWord = 0;

function typeEffect() {
    let header = document.getElementById('typingHeader');
    let text = "lara's poetry ";
    let i = text.length;
    let direction = 1;

    // Start by setting the static part of the header
    header.innerHTML = text;

    function typing() {
        if (direction === 1 && i < text.length + cycleWords[currentWord].length) {
            header.innerHTML += cycleWords[currentWord].charAt(i - text.length);
            i++;
        } else if (direction === -1 && i > text.length) {
            header.innerHTML = header.innerHTML.slice(0, -1);
            i--;
        }

        if (i === text.length + cycleWords[currentWord].length && direction === 1) {
            setTimeout(typing, 2000); // Wait at the end of typing a word before starting to delete
            direction = -1;
        } else if (i === text.length && direction === -1) {
            currentWord = (currentWord + 1) % cycleWords.length;
            direction = 1;
        } else {
            setTimeout(typing, direction === 1 ? 150 : 100); // Typing speed for adding or removing characters
        }
    }

    typing();
}
