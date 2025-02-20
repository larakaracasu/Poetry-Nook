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
    let poemSections = data.split(/\n\n\*/).map(section => section.trim()); // Split poems at \n\n followed by *
    
    poemSections.forEach(poemStr => {
        let lines = poemStr.split('\n');
        let title = lines.shift().replace('*', '').trim(); // Remove * from title
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
        gridItem.style.border = '1px solid #ccc'; // Ensure each poem is inside a tile
        gridItem.style.padding = '10px';
        gridItem.style.margin = '10px';
        gridItem.style.borderRadius = '5px';
        gridItem.style.backgroundColor = '#f9f9f9';
        
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
