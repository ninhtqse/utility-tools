let regexTimeout;

function updateRegex() {
    clearTimeout(regexTimeout);
    regexTimeout = setTimeout(() => {
        const pattern = document.getElementById('regex-pattern').value;
        const testString = document.getElementById('regex-test').value;
        const language = document.getElementById('regex-language').value;
        const flags = getFlags();

        if (!pattern || !testString) {
            clearResults();
            return;
        }

        try {
            const matches = findMatches(pattern, testString, flags);
            displayMatches(matches, testString);
            displayCode(pattern, flags, language);
        } catch (error) {
            showError(error.message);
        }
    }, 300);
}

function getFlags() {
    const flags = [];
    if (document.getElementById('flag-g').checked) flags.push('g');
    if (document.getElementById('flag-i').checked) flags.push('i');
    if (document.getElementById('flag-m').checked) flags.push('m');
    if (document.getElementById('flag-s').checked) flags.push('s');
    return flags.join('');
}

function findMatches(pattern, text, flags) {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                value: match[0],
                index: match.index,
                groups: match.slice(1)
            });
        }
    } else {
        match = regex.exec(text);
        if (match) {
            matches.push({
                value: match[0],
                index: match.index,
                groups: match.slice(1)
            });
        }
    }

    return matches;
}

function displayMatches(matches, text) {
    const matchesDiv = document.getElementById('regex-matches');
    matchesDiv.innerHTML = '';

    if (matches.length === 0) {
        matchesDiv.innerHTML = '<div class="regex-no-match">No matches found</div>';
        return;
    }

    let lastIndex = 0;
    let highlightedText = '';

    matches.forEach((match, i) => {
        // Add text before match
        highlightedText += escapeHtml(text.substring(lastIndex, match.index));
        // Add highlighted match
        highlightedText += `<span class="regex-highlight">${escapeHtml(match.value)}</span>`;
        lastIndex = match.index + match.value.length;

        // Add match details
        const matchDiv = document.createElement('div');
        matchDiv.className = 'regex-match';
        matchDiv.innerHTML = `
            <div><span class="regex-match-index">Match ${i + 1}:</span> <span class="regex-match-value">${escapeHtml(match.value)}</span></div>
            <div>Index: ${match.index}</div>
            ${match.groups.length ? `<div>Groups: ${match.groups.map(g => `"${escapeHtml(g)}"`).join(', ')}</div>` : ''}
        `;
        matchesDiv.appendChild(matchDiv);
    });

    // Add remaining text
    highlightedText += escapeHtml(text.substring(lastIndex));
}

function displayCode(pattern, flags, language) {
    const codeDiv = document.getElementById('regex-code-sample');
    let code = '';

    switch (language) {
        case 'javascript':
            code = `const regex = /${pattern}/${flags};
const str = "your_string";
const matches = str.match(regex);
// or
let match;
while ((match = regex.exec(str)) !== null) {
    console.log(match);
}`;
            break;
        case 'php':
            code = `$pattern = '/${pattern}/${flags}';
$subject = "your_string";
preg_match_all($pattern, $subject, $matches);
print_r($matches);`;
            break;
        case 'python':
            code = `import re

pattern = r'${pattern}'
text = "your_string"
matches = re.${flags.includes('g') ? 'findall' : 'search'}(pattern, text${flags.includes('i') ? ', re.IGNORECASE' : ''}${flags.includes('m') ? ', re.MULTILINE' : ''}${flags.includes('s') ? ', re.DOTALL' : ''})
print(matches)`;
            break;
        case 'java':
            code = `Pattern pattern = Pattern.compile("${pattern}"${getJavaFlags(flags)});
Matcher matcher = pattern.matcher("your_string");
while (matcher.find()) {
    System.out.println("Found: " + matcher.group());
}`;
            break;
    }

    codeDiv.textContent = code;
}

function getJavaFlags(flags) {
    const javaFlags = [];
    if (flags.includes('i')) javaFlags.push('Pattern.CASE_INSENSITIVE');
    if (flags.includes('m')) javaFlags.push('Pattern.MULTILINE');
    if (flags.includes('s')) javaFlags.push('Pattern.DOTALL');
    return javaFlags.length ? ', ' + javaFlags.join(' | ') : '';
}

function showError(message) {
    const matchesDiv = document.getElementById('regex-matches');
    matchesDiv.innerHTML = `<div class="regex-error">${escapeHtml(message)}</div>`;
    document.getElementById('regex-code-sample').textContent = '';
}

function clearResults() {
    document.getElementById('regex-matches').innerHTML = '';
    document.getElementById('regex-code-sample').textContent = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.getElementById('regex-pattern').addEventListener('input', updateRegex);
document.getElementById('regex-test').addEventListener('input', updateRegex);
document.getElementById('regex-language').addEventListener('change', updateRegex);
document.querySelectorAll('.regex-flags input').forEach(input => {
    input.addEventListener('change', updateRegex);
}); 