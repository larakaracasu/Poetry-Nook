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
    // ...existing parsing function...
}

function sortPoems(poems) {
    // ...existing sorting function...
}

function populatePoem(poem) {
    // ...existing poem population function...
}
