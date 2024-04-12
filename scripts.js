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

function typeEffect() {
    let text = "lara's poetry nook 📖";
    let i = 0;
    let header = document.getElementById('typingHeader');
    function typing() {
        if (i < text.length) {
            header.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 150);
        } else {
            header.innerHTML = '';
            i = 0;
            setTimeout(typing, 2500);
        }
    }
    typing();
}
