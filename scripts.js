// Global variables for pagination
let currentPage = 1;
let poemsPerPage = 5; // adjust this to display more or less poems per page
let displayedPoems = [];

// Enhanced to include search functionality
function searchPoems() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const filteredPoems = parsedPoems.filter(poem => 
        poem.title.toLowerCase().includes(searchQuery) || 
        poem.lines.some(line => line.toLowerCase().includes(searchQuery))
    );
    displayedPoems = sortPoems(filteredPoems);
    currentPage = 1;
    displayCurrentPoems();
}

function displayCurrentPoems() {
    const container = document.getElementById('poemContainer');
    container.innerHTML = ''; // Clear previous poems
    const startIndex = (currentPage - 1) * poemsPerPage;
    const endIndex = startIndex + poemsPerPage;
    const poemsToShow = displayedPoems.slice(startIndex, endIndex);

    poemsToShow.forEach(populatePoem);
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

// Adding a typing animation for the header
function typeEffect(element, text, delay = 100) {
    element.innerHTML = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, delay);
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
