// Shared functionality across tools
document.addEventListener('DOMContentLoaded', () => {
    // Theme support (could be expanded later)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        // User prefers dark theme, could add dark theme support here
    }
    
    // Global event listeners
    document.addEventListener('keydown', (e) => {
        // Global keyboard shortcuts could go here
        // e.g., Ctrl+/ to show help, Ctrl+, for settings, etc.
    });
    
    // Tool metrics - useful for understanding which tools are most popular
    const recordToolUsage = (toolId) => {
        // This could be expanded to send analytics data
        // For now, just log to console
        console.log(`Tool used: ${toolId} at ${new Date().toISOString()}`);
        
        // Could store in localStorage for simple metrics
        try {
            const usageData = JSON.parse(localStorage.getItem('toolUsage') || '{}');
            usageData[toolId] = (usageData[toolId] || 0) + 1;
            localStorage.setItem('toolUsage', JSON.stringify(usageData));
        } catch (e) {
            // Ignore errors with localStorage
        }
    };
    
    // Listen for tool navigation events
    window.addEventListener('hashchange', () => {
        const currentTool = window.location.hash.substring(1);
        if (currentTool) {
            recordToolUsage(currentTool);
        }
    });
    
    // Record initial tool visit
    const initialTool = window.location.hash.substring(1) || 'peeler';
    recordToolUsage(initialTool);
    
    // Help with new tool discovery
    // Show a small notification when new tools are added
    const checkForNewTools = () => {
        try {
            const lastVisit = localStorage.getItem('lastVisit') || '';
            const knownTools = JSON.parse(localStorage.getItem('knownTools') || '[]');
            
            // Get all current tools
            const currentTools = Array.from(
                document.querySelectorAll('.nav-link')
            ).map(link => link.getAttribute('data-tool'));
            
            // Find new tools
            const newTools = currentTools.filter(tool => !knownTools.includes(tool));
            
            if (newTools.length > 0) {
                // Could show a notification about new tools here
                console.log('New tools available:', newTools);
            }
            
            // Update known tools and last visit
            localStorage.setItem('knownTools', JSON.stringify(currentTools));
            localStorage.setItem('lastVisit', new Date().toISOString());
        } catch (e) {
            // Ignore errors with localStorage
        }
    };
    
    // Check for new tools
    checkForNewTools();
});