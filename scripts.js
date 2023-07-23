window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => populatePoems(data));
}

function populatePoems(data) {
    var container = document.getElementById('poemContainer');
    var poems = data.split("*"); 

    poems.forEach(function(poemStr) {
        poemStr = poemStr.trim(); // remove leading and trailing whitespace
        var poemLines = poemStr.split("\n");
        var titleText = poemLines.shift();

        var gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        var title = document.createElement('h2');
        title.innerText = titleText;
        gridItem.appendChild(title);

        var poemText = document.createElement('p');
        poemText.className = 'poem';
        poemText.innerText = poemLines.join('\n');
        gridItem.appendChild(poemText);

        container.appendChild(gridItem);
    });
}
