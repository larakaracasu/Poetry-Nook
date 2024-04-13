let parsedPoems = [];
let searchSuggestions = ['gold panning', 'return address', "i'm not lost"];  // Suggestions for the search bar
let timeoutId;  // This will hold the timeout so that it can be cleared when the user interacts with the search bar

window.onload = function() {
    fetch('poems.txt')
        .then(response => response.text())
        .then(data => {
            parsedPoems = parsePoems(data);
            const sortedPoems = sortPoems(parsedPoems);
            populatePoems(sortedPoems);
            typeEffect('typingHeader', ['nook', 'booklet', 'haven']);  // Start typing effect on header immediately
            setTimeout(() => typeEffect('searchBar', searchSuggestions, 200, 150), 5000);  // Delay start on search bar
        })
        .catch(error => {
            console.error('There was a problem fetching the poems:', error);
        });
};

function typeEffect(elementId, words, typingSpeed = 150, deletingSpeed = 100) {
    let target = document.getElementById(elementId);
    let currentWord = 0;
    let baseText = elementId === 'typingHeader' ? "lara's poetry " : '';
    let i = 0;
    let direction = 1;

    function typing() {
        if (direction === 1) {
            if (i < words[currentWord].length) {
                if (target.tagName === 'INPUT') {
                    target.value = baseText + words[currentWord].substring(0, i + 1);
                } else {
                    target.innerHTML = baseText + words[currentWord].substring(0, i + 1);
                }
                i++;
                timeoutId = setTimeout(typing, typingSpeed);
            } else {
                timeoutId = setTimeout(typing, 2000); // Longer pause at the end of each word
                direction = -1;
            }
        } else {
            if (i > 0) {
                if (target.tagName === 'INPUT') {
                    target.value = baseText + words[currentWord].substring(0, i - 1);
                } else {
                    target.innerHTML = baseText + words[currentWord].substring(0, i - 1);
                }
                i--;
                timeoutId = setTimeout(typing, deletingSpeed);
            } else {
                direction = 1;
                currentWord = (currentWord + 1) % words.length;
                i = 0;
                timeoutId = setTimeout(typing, 1000); // Longer pause before restarting typing
            }
        }
    }

    typing();
}

// Add event listeners to stop the typing effect when the search bar is interacted with
document.getElementById('searchBar').addEventListener('focus', () => clearTimeout(timeoutId));
document.getElementById('searchBar').addEventListener('input', () => clearTimeout(timeoutId));
