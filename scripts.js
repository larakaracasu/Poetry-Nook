window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            // Parse the poems from the fetched data
            const parsedPoems = parsePoems(data);
            // Sort the poems
            const sortedPoems = sortPoems(parsedPoems);
            // Display the poems
            populatePoems(sortedPoems);
        });
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
