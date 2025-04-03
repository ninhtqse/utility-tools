async function formatJSON() {
    const jsonInput = document.getElementById('json-input').value;
    const res = await fetch('http://localhost:3000/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: jsonInput })
    });
    const data = await res.json();
    document.getElementById('json-output').innerText = data.success ? data.formattedJson : 'Invalid JSON';
}

async function minifyJSON() {
    const jsonInput = document.getElementById('json-input').value;
    const res = await fetch('http://localhost:3000/json/minify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: jsonInput })
    });
    const data = await res.json();
    document.getElementById('json-output').innerText = data.success ? data.minifiedJson : 'Invalid JSON';
}

function encodeJSON() {
    const jsonInput = document.getElementById('json-input').value;
    try {
        // Convert text to JSON string by escaping special characters
        const encodedJson = JSON.stringify(jsonInput);
        document.getElementById('json-output').innerText = encodedJson;
    } catch (error) {
        document.getElementById('json-output').innerText = 'Invalid input for JSON encoding';
    }
}

let currentTreeData = null;

function viewJSONTree() {
    const jsonInput = document.getElementById('json-input').value;
    const treeContainer = document.getElementById('json-tree');
    const output = document.getElementById('json-output');
    
    try {
        // Clear previous content
        treeContainer.innerHTML = '';
        output.style.display = 'none';
        
        // Parse JSON input
        const data = JSON.parse(jsonInput);
        
        // Create and append tree
        const tree = renderJson(data);
        treeContainer.innerHTML = tree;
        treeContainer.style.display = 'block';

        // Add click handlers for toggling
        treeContainer.querySelectorAll('.toggle-node').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const nestedContent = this.nextElementSibling;
                if (nestedContent.style.display === 'none') {
                    nestedContent.style.display = 'block';
                    this.innerHTML = this.innerHTML.replace('▶', '▼');
                } else {
                    nestedContent.style.display = 'none';
                    this.innerHTML = this.innerHTML.replace('▼', '▶');
                }
            });
        });
    } catch (error) {
        // Show error in output
        output.style.display = 'block';
        output.innerText = `Invalid JSON: ${error.message}`;
        treeContainer.style.display = 'none';
    }
}

function renderJson(data) {
    let html = '<ul style="padding-left: 1em; list-style: none;">';
    
    if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                html += `
                    <li style="margin-bottom: 0.5em;">
                        <div class="toggle-node" style="cursor: pointer;">
                            ▶ <span class="json-key">${key}:</span>
                        </div>
                        <div class="nested-content" style="display: none;">
                            ${renderJson(value)}
                        </div>
                    </li>`;
            } else {
                html += `
                    <li class="json-item">
                        <span class="json-key">${key}:</span>
                        <span class="json-value">${JSON.stringify(value)}</span>
                    </li>`;
            }
        }
    } else {
        html += `<li class="json-value">${JSON.stringify(data)}</li>`;
    }
    
    html += '</ul>';
    return html;
}

function expandAll() {
    const treeContainer = document.getElementById('json-tree');
    treeContainer.querySelectorAll('.toggle.collapsed').forEach(toggle => {
        toggle.click();
    });
}

function collapseAll() {
    const treeContainer = document.getElementById('json-tree');
    treeContainer.querySelectorAll('.toggle.expanded').forEach(toggle => {
        toggle.click();
    });
}

function sortTree() {
    if (currentTreeData) {
        viewJSONTree();
    }
}

function searchInTree(query) {
    const treeContainer = document.getElementById('json-tree');
    const elements = treeContainer.querySelectorAll('.key, .string, .number, .boolean, .null');
    
    elements.forEach(element => {
        element.classList.remove('highlight');
        const text = element.textContent.replace('📋', '').trim().toLowerCase();
        if (text.includes(query.toLowerCase())) {
            element.classList.add('highlight');
            // Expand parent nodes
            let parent = element.parentElement;
            while (parent && !parent.classList.contains('json-tree')) {
                const toggle = parent.querySelector('.toggle');
                if (toggle && toggle.classList.contains('collapsed')) {
                    toggle.click();
                }
                parent = parent.parentElement;
            }
        }
    });
}

function formatValue(value) {
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
}