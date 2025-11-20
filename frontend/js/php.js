require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs" }});
require(["vs/editor/editor.main"], function () {
    window.phpEditor = monaco.editor.create(document.getElementById("monaco-container"), {
        value: "<?php\n\n",
        language: "php",
        theme: "vs-dark",
        automaticLayout: true
    });
});

async function runPHPCode() {
    const code = phpEditor.getValue();

    const response = await fetch("https://utility-api.ninhtqse.xyz/run-php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    });

    const result = await response.json();
    document.getElementById('php-output').innerText = result.output;
}
