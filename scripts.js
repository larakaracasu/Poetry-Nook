let parsedPoems = [];

window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            populatePoems(parsedPoems);
            typeEffect(document.getElementById('typingHeader'), 'lara\'s poetry nook 📖');
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
    var sortedPoems = poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
    return sortedPoems;
}

function populatePoems(poems) {
    var container = document.getElementById('poemContainer');
    container.innerHTML = '';  // Clear existing poems first
    poems.forEach(function(poem) {
        var gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        var title = document.createElement('h2');
        title.innerText = poem.title;
        gridItem.appendChild(title);
        var poemText = document.createElement('p');
        poemText.className = 'poem';
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

function typeEffect(element, text, delay = 100) {
    let i = 0;
    const typing = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, delay);
        } else {
            element.textContent = '';  // Clear and restart typing effect
            i = 0;
            setTimeout(typing, 2500); // Wait before restart
        }
    };
    typing();
}
