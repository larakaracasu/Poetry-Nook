let parsedPoems = [];
let searchSuggestions = ['romantic poems', 'classic poetry', 'modern verses'];  // Suggestions for search bar

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


function typeEffect(elementId, words) {
    let target = document.getElementById(elementId);
    let currentWord = 0;
    let baseText = elementId === 'typingHeader' ? "lara's poetry " : '';  // Conditional base text
    target.innerHTML = baseText;
    let i = 0;
    let direction = 1;

    function typing() {
        if (direction === 1) {
            if (i < words[currentWord].length) {
                target.innerHTML += words[currentWord].charAt(i);
                i++;
                setTimeout(typing, 150);
            } else {
                setTimeout(typing, 2000);
                direction = -1;
            }
        } else {
            if (i > 0) {
                target.innerHTML = baseText + words[currentWord].slice(0, i - 1);
                i--;
                setTimeout(typing, 100);
            } else {
                direction = 1;
                currentWord = (currentWord + 1) % words.length;
                i = 0;  // Ensure i is reset
                setTimeout(typing, 500);
            }
        }
    }

    typing();
}
