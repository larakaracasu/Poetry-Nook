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

function parsePoems(data) {
    let poems = [];
    let poemSections = data.split(/\n\n\*/).map(section => section.trim());
    
    poemSections.forEach((poemStr, index) => {
        let lines = poemStr.split('\n');
        let title = index === 0 && !poemStr.startsWith('*') ? lines.shift().trim() : lines.shift().replace('*', '').trim();
        let formattedLines = lines.join('\n'); // Preserve stanza breaks
        poems.push({ title, lines: formattedLines });
    });
    
    return poems;
}

function sortPoems(poems) {
    return poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
}

function populatePoems(poems) {
    let container = document.getElementById('poemContainer');
    container.innerHTML = '';
    
    poems.forEach(function(poem) {
        let gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        let title = document.createElement('h2');
        title.innerHTML = `<b>${poem.title}</b>`;  // Make the title bold
        gridItem.appendChild(title);
        
        let poemText = document.createElement('p');
        poemText.innerHTML = poem.lines.replace(/\n\n/g, '<br><br>'); // Preserve stanza breaks visually
        gridItem.appendChild(poemText);
        
        container.appendChild(gridItem);
    });
}

function searchPoems() {
    let searchQuery = document.getElementById('searchBar').value.toLowerCase();
    let filteredPoems = sortPoems(parsedPoems.filter(poem => 
        poem.title.toLowerCase().includes(searchQuery) || 
        poem.lines.toLowerCase().includes(searchQuery)
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
