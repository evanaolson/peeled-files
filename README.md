# Peeled Files

A simple web tool that extracts filenames from complete file paths. Perfect for cleaning up Mac Option+Click copied paths before pasting into Excel or other applications.

![Peeled Files Tool](images/nutrition-rot30.svg)

## Overview

Peeled Files is a lightweight client-side web application that helps users extract just the filenames from full file paths. It's particularly useful for Mac users who often get full paths when using Option+Click to copy files, which can be cumbersome when trying to create lists of just filenames.

## Features

- Extract filenames from complete file paths
- Option to keep or remove file extensions
- Support for multiple input methods:
  - Direct text input
  - Paste from clipboard
  - Drag and drop text
- Copy results to clipboard with one click
- Clean, responsive design
- Works entirely client-side (no server processing)

## Project Structure

```
peeled-files/
├── index.html      # Main HTML structure
├── peel.css        # Styling for the application
├── peel.js         # JavaScript functionality
└── images/         # Directory containing icon assets
    ├── nutrition-rot30.svg
    └── nutrition-rot30.png
```

## Technical Implementation

### HTML (`index.html`)

The HTML file provides the structure of the application with these key elements:

- Metadata and SEO information
- External resources (Google Material Icons)
- Main UI components:
  - Header with icon and title
  - Drop area for drag & drop functionality
  - Controls (checkbox for file extension option, "Peel It" button)
  - Input textarea for pasting paths
  - Output area with result textarea and copy button
  - Footer with brief description

### CSS (`peel.css`)

The stylesheet defines the visual styling of the application, including:

- Basic typography and colors
- Layout and spacing
- Interactive elements (buttons, dropdowns)
- Responsive design considerations
- Visual feedback for user interactions (hover states, etc.)

### JavaScript (`peel.js`)

The JavaScript file handles all functionality, including:

1. **DOM Element Selection**: Gets references to all interactive elements
2. **Event Listeners**: Sets up interactions for:
   - Click on drop area (triggers clipboard paste)
   - Document-wide paste event
   - Drag and drop events (dragover, dragleave, drop)
   - Input changes
   - Button clicks (strip paths, copy results)
3. **Core Functionality**:
   - `checkInput()`: Enables/disables the strip button based on input
   - `peelFilepaths()`: The main function that processes input paths to extract filenames

## How the Core Function Works

The main functionality is in the `peelFilepaths()` function, which:

1. Gets input text and the extension preference
2. Splits input by quotation marks or whitespace to handle multiple paths
3. For each path:
   - Removes quotes if present
   - Extracts just the filename (everything after the last slash or backslash)
   - Optionally removes the file extension
4. Joins the processed filenames with newlines
5. Updates the output area and enables the copy button

## How to Add a New Tool

To add a new tool or feature to this project, follow these steps:

### 1. Plan Your Feature

Decide what functionality you want to add. Good candidates might be:
- Batch renaming preview
- Additional file path transformations
- Support for different path formats or pattern matching

### 2. Update the HTML

Add the necessary UI elements in `index.html`. For example, to add a new option:

```html
<div class="controls">
    <!-- Existing controls -->
    <div class="checkbox-container">
        <input type="checkbox" id="yourNewOption">
        <label for="yourNewOption">Your New Option</label>
    </div>
</div>
```

Or to add a new tool section:

```html
<div class="new-tool-section">
    <h2>Your New Tool</h2>
    <!-- Tool-specific controls and output -->
    <button id="newToolButton">Process</button>
    <textarea id="newToolOutput" readonly></textarea>
</div>
```

### 3. Add Styles in CSS

Update `peel.css` to include styles for your new elements:

```css
.new-tool-section {
    border-top: 1px solid #f0e8d8;
    padding-top: 20px;
    margin-top: 20px;
}

/* Add specific styles for your new elements */
```

### 4. Implement JavaScript Functionality

Extend `peel.js` with your new functionality:

```javascript
// Get references to new DOM elements
const newToolButton = document.getElementById('newToolButton');
const newToolOutput = document.getElementById('newToolOutput');

// Add event listeners
newToolButton.addEventListener('click', runNewTool);

// Implement new functionality
function runNewTool() {
    const input = inputText.value;
    // Your processing logic here
    const result = yourProcessingFunction(input);
    newToolOutput.value = result;
}

function yourProcessingFunction(input) {
    // Implement your specific logic
    // Return the processed result
}
```

### 5. Integration Tips

- Follow the existing code style for consistency
- Leverage the existing input mechanisms if possible
- Consider how your new tool interacts with existing features
- Test thoroughly across different browsers
- Keep the UI clean and intuitive

### Example: Adding a "Convert to Title Case" Tool

Here's a concrete example of adding a simple tool that converts filenames to title case:

1. **HTML**: Add a new button in the controls section:

```html
<div class="controls">
    <!-- Existing controls -->
    <button id="titleCaseButton">Title Case</button>
</div>
```

2. **CSS**: Add styling for the new button:

```css
#titleCaseButton {
    background-color: #3498db;
    margin-left: 10px;
}

#titleCaseButton:hover {
    background-color: #2980b9;
}
```

3. **JavaScript**: Implement the title case functionality:

```javascript
// Get DOM element
const titleCaseButton = document.getElementById('titleCaseButton');

// Add event listener
titleCaseButton.addEventListener('click', convertToTitleCase);

// Implement function
function convertToTitleCase() {
    // Get current output or input text
    const text = outputText.value || inputText.value;
    if (!text.trim()) return;
    
    const lines = text.split('\n');
    const titleCasedLines = lines.map(line => {
        return line.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    });
    
    outputText.value = titleCasedLines.join('\n');
    copyButton.disabled = false;
}
```

## Deployment

The project is designed to work as a static website. You can:

1. Host it on any static web hosting service (GitHub Pages, Netlify, etc.)
2. Use it locally by opening the HTML file in a web browser
3. Download it for offline use, as mentioned in the footer

## Browser Compatibility

The tool uses standard modern JavaScript and should work in all current browsers, including:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari

## Future Enhancement Ideas

Some potential features that could be added:
- Dark mode toggle
- Saving user preferences
- Additional file path transformations
- Batch processing of different formats
- Export to CSV or other formats

## License

Not specified in the original files. Consider adding an appropriate license if you plan to share this tool.