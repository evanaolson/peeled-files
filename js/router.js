// Simple router for switching between tools
class ToolRouter {
    constructor() {
        this.contentArea = document.getElementById('content-area');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentTool = null;
        this.tools = {
            'peeler': {
                title: 'Peeled Files',
                path: 'pages/peeler.html',
                script: 'js/tools/peeler.js'
            },
            'rotator': {
                title: 'WebP Rotator',
                path: 'pages/rotator.html',
                script: 'js/tools/rotator.js'
            }
            // Add more tools here as they are created
        };
        
        this.init();
    }
    
    init() {
        // Set up navigation event listeners
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const toolId = link.getAttribute('data-tool');
                this.navigateTo(toolId);
            });
        });
        
        // Handle initial route
        window.addEventListener('DOMContentLoaded', () => {
            let initialTool = 'peeler'; // Default tool
            
            // Check for hash in URL
            if (window.location.hash) {
                const hashTool = window.location.hash.substring(1);
                if (this.tools[hashTool]) {
                    initialTool = hashTool;
                }
            }
            
            this.navigateTo(initialTool);
        });
        
        // Handle browser back/forward navigation
        window.addEventListener('hashchange', () => {
            const hashTool = window.location.hash.substring(1);
            if (this.tools[hashTool] && hashTool !== this.currentTool) {
                this.navigateTo(hashTool);
            }
        });
    }
    
    async navigateTo(toolId) {
        if (!this.tools[toolId] || toolId === this.currentTool) return;
        
        // Update active navigation link
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-tool') === toolId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update window hash
        window.location.hash = toolId;
        
        // Show loading state
        this.contentArea.innerHTML = '<div class="loading">Loading tool...</div>';
        
        try {
            // Fetch the tool's HTML template
            const response = await fetch(this.tools[toolId].path);
            if (!response.ok) throw new Error('Failed to load tool content');
            
            const htmlContent = await response.text();
            this.contentArea.innerHTML = htmlContent;
            
            // Load and execute the tool's JavaScript
            await this.loadScript(this.tools[toolId].script);
            
            // Update the current tool
            this.currentTool = toolId;
            
            // Update document title
            document.title = `${this.tools[toolId].title} | Dev Tools`;
        } catch (error) {
            console.error('Error loading tool:', error);
            this.contentArea.innerHTML = `
                <div class="tool-container">
                    <div class="error-message">
                        <h2>Error Loading Tool</h2>
                        <p>Sorry, we couldn't load the requested tool. Please try again later.</p>
                    </div>
                </div>
            `;
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Remove any existing script with the same src
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
}

// Initialize the router
document.addEventListener('DOMContentLoaded', () => {
    window.router = new ToolRouter();
});