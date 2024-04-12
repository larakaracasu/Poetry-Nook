let currentPage = 1;
let poemsPerPage = 20;
let displayedPoems = [];

function searchPoems() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    displayedPoems = parsedPoems.filter(poem =>
        poem.title.toLowerCase().includes(searchQuery) ||
        poem.lines.some(line => line.toLowerCase().includes(searchQuery))
    );
    currentPage = 1;
    displayCurrentPoems();
}

function displayCurrentPoems() {
    const container = document.getElementById('poemContainer');
    container.innerHTML = ''; // Clear previous poems
    const startIndex = (currentPage - 1) * poemsPerPage;
    const endIndex = startIndex + poemsPerPage;
    const poemsToShow = displayedPoems.slice(startIndex, endIndex);

    poemsToShow.forEach(poem => populatePoem(poem));
    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${Math.ceil(displayedPoems.length / poemsPerPage)}`;
}

function nextPage() {
    if (currentPage * poemsPerPage < displayedPoems.length) {
        currentPage++;
        displayCurrentPoems();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPoems();
    }
}

// Typing effect
function typeEffect(element, text, delay = 150) {
    element.innerHTML = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, delay);
        } else {
            // After a short pause, reset and start the typing effect again
            setTimeout(() => {
                element.innerHTML = "";
                i = 0;
                typing();
            }, 1500);
        }
    }
    typing();
}

window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            displayedPoems = sortPoems(parsedPoems);
            displayCurrentPoems();
        });

    const header = document.getElementById('typingHeader');
    typeEffect(header, header.innerText);
}

function parsePoems(data) {
    var poemStrs = data.split("\n\n*").map(poem => poem.trim());  // Split using "\r\n\r\n*"

    // Convert each poem string into an object with separate title and lines properties
    var poems = poemStrs.map(function(poemStr) {
        var poemLines = poemStr.split("\n");
        var title = poemLines.shift();
        title = title.replace('*', ''); // remove the asterisk from the title
        return { title: title.trim(), lines: poemLines }; // use trim() to remove any leading/trailing spaces from the title
    });

    return poems;
}

function sortPoems(poems) {
    console.log('Before sorting::', poems.map(poem => poem.title));  // log titles before sorting
    var sortedPoems = poems.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
    console.log('After sorting::', sortedPoems.map(poem => poem.title));  // log titles after sorting
    return sortedPoems;
}

function populatePoems(poems) {
    var container = document.getElementById('poemContainer');

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
