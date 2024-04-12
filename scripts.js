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
    let baseText = "lara's poetry ";
    header.innerHTML = baseText;
    let i = 0;
    let direction = 1;

    function typing() {
        console.log('Typing:', cycleWords[currentWord], 'Direction:', direction, 'Index i:', i);
        if (direction === 1) {
            if (i < cycleWords[currentWord].length) {
                header.innerHTML += cycleWords[currentWord].charAt(i);
                i++;
                setTimeout(typing, 150);
            } else {
                setTimeout(typing, 2000);
                direction = -1;
            }
        } else {
            if (i > 0) {
                header.innerHTML = baseText + cycleWords[currentWord].slice(0, i - 1);
                i--;
                setTimeout(typing, 100);
            } else {
                direction = 1;
                currentWord = (currentWord + 1) % cycleWords.length;
                i = 0; // Ensure i is reset
                setTimeout(typing, 500);
            }
        }
    }

    typing();
}
