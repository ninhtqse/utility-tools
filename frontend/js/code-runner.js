let editor;

// Initialize Monaco Editor
window.addEventListener('load', function() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('monaco-container'), {
            value: '<?php\n// PHP Code\n$message = "Hello, World!";\necho $message;',
            language: 'php',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true
        });

        // Initialize Select2 for language selection
        $('#language-select').select2({
            theme: 'bootstrap-5',
            width: '100%'
        });

        // Handle language change
        $('#language-select').on('change', function() {
            const language = $(this).val();
            monaco.editor.setModelLanguage(window.editor.getModel(), language);
            
            // Set default code based on language
            const defaultCodes = {
                'php': '<?php\n// PHP Code\n$message = "Hello, World!";\necho $message;',
                'javascript': '// JavaScript Code\nconsole.log("Hello, World!");',
                'python': '# Python Code\nprint("Hello, World!")',
                'java': '// Java Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
                'cpp': '// C++ Code\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
                'csharp': '// C# Code\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
                'ruby': '# Ruby Code\nputs "Hello, World!"',
                'go': '// Go Code\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
                'rust': '// Rust Code\nfn main() {\n    println!("Hello, World!");\n}',
                'swift': '// Swift Code\nprint("Hello, World!")'
            };
            
            window.editor.setValue(defaultCodes[language] || '');
        });
    });
});

// Run code function
async function runCode() {
    const code = window.editor.getValue();
    const language = $('#language-select').val();
    const outputArea = document.getElementById('code-output');

    try {
        outputArea.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

        const response = await fetch('https://api-utility.ninhtqse.site/run-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language })
        });

        const data = await response.json();

        if (data.error) {
            outputArea.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        } else {
            outputArea.innerHTML = `<pre class="bg-dark text-light p-3 rounded">${data.output || 'No output'}</pre>`;
        }
    } catch (error) {
        outputArea.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

// Clear output function
function clearOutput() {
    document.getElementById('code-output').innerHTML = '';
}