// Peeled Files Tool
(function() {
    // Get DOM elements
    const dropArea = document.getElementById('drop-area');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const stripButton = document.getElementById('stripButton');
    const copyButton = document.getElementById('copyButton');
    const keepExtension = document.getElementById('keepExtension');

    // Add event listeners
    dropArea.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            checkInput();
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            alert('Could not access clipboard. Please paste manually into the text area below.');
        }
    });

    // Handle pasting directly into the document
    document.addEventListener('paste', (e) => {
        if (e.clipboardData && e.clipboardData.getData) {
            const text = e.clipboardData.getData('text/plain');
            if (text) {
                inputText.value = text;
                checkInput();
            }
        }
    });

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('active');
    });

    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
        
        let text = '';
        
        // Try to get text from dataTransfer
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            inputText.value = event.target.result;
                            checkInput();
                        };
                        reader.readAsText(file);
                        return;
                    }
                } else if (e.dataTransfer.items[i].kind === 'string') {
                    e.dataTransfer.items[i].getAsString(function(s) {
                        inputText.value = s;
                        checkInput();
                    });
                    return;
                }
            }
        } else if (e.dataTransfer.getData) {
            // Use DataTransfer interface
            text = e.dataTransfer.getData('Text');
            if (text) {
                inputText.value = text;
                checkInput();
            }
        }
    });

    inputText.addEventListener('input', checkInput);

    stripButton.addEventListener('click', peelFilepaths);

    copyButton.addEventListener('click', () => {
        outputText.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(outputText.value)
                .then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy Result';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback to execCommand
                    document.execCommand('copy');
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy Result';
                    }, 2000);
                });
        } else {
            // Fallback for older browsers
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy Result';
            }, 2000);
        }
    });

    // Helper functions
    function checkInput() {
        stripButton.disabled = !inputText.value.trim();
    }

    function peelFilepaths() {
        const input = inputText.value;
        const shouldKeepExtension = keepExtension.checked;
        
        // Split by quotation marks or whitespace
        const paths = input.match(/('[^']*')|("[^"]*")|(\S+)/g) || [];
        
        const filenames = paths.map(path => {
            // Remove quotes if present
            path = path.replace(/^['"]|['"]$/g, '');
            
            // Extract filename (everything after the last slash or backslash)
            let filename = path.replace(/^.*[\\\/]/, '');
            
            // Remove extension if needed
            if (!shouldKeepExtension) {
                filename = filename.replace(/\.[^.]+$/, '');
            }
            
            return filename;
        });
        
        outputText.value = filenames.join('\n');
        copyButton.disabled = false;
    }
})();