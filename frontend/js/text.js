function convertToSentenceCase() {
    let text = document.getElementById("text-input").value.toLowerCase();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    document.getElementById("text-output").innerText = text;
}

function convertToUpperCase() {
    let text = document.getElementById("text-input").value.toUpperCase();
    document.getElementById("text-output").innerText = text;
}

function convertToLowerCase() {
    let text = document.getElementById("text-input").value.toLowerCase();
    document.getElementById("text-output").innerText = text;
}

function generateLoremIpsum() {
    let paragraphs = parseInt(document.getElementById("lorem-paragraphs").value) || 1;
    let wordsPerSentence = parseInt(document.getElementById("lorem-words").value) || 10;
    let totalChars = parseInt(document.getElementById("lorem-chars").value) || 100;

    const loremBase = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
    let words = loremBase.split(" ");
    let output = "";

    for (let i = 0; i < paragraphs; i++) {
      let paragraph = "";
      while (paragraph.length < totalChars) {
        let sentence = words.slice(0, wordsPerSentence).join(" ") + ". ";
        if (paragraph.length + sentence.length > totalChars) {
          sentence = sentence.slice(0, totalChars - paragraph.length); 
        }
        paragraph += sentence;
      }
      output += paragraph.trim() + "\n\n";
    }
    document.getElementById("lorem-output").innerText = output;
}

function countLetters() {
    let text = document.getElementById("text-input").value;
    let letterCount = text.length;

    let words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let wordMap = {};

    words.forEach(word => {
        wordMap[word] = (wordMap[word] || 0) + 1;
    });

    let duplicateWords = Object.entries(wordMap)
        .filter(([_, count]) => count > 1)
        .map(([word, count]) => `    ${word}: ${count} times`)
        .join('\n');

    let duplicateRatio = words.length > 0 ? (Object.values(wordMap).filter(c => c > 1).length / words.length * 100).toFixed(2) : 0;

    document.getElementById("text-output").innerText = `Letter Count: ${letterCount}\nDuplicate Word Ratio: ${duplicateRatio}%${duplicateWords ? '\nDuplicate Words:\n' + duplicateWords : ''}`;
}

