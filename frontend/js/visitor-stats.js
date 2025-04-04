// Track visitor when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a tab parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    // If there's a tab parameter, open that tab
    if (tabParam) {
        const tabButton = document.querySelector(`.nav-item[onclick*="${tabParam}"]`);
        if (tabButton) {
            // Create a fake event object
            const fakeEvent = { currentTarget: tabButton };
            // Call openTab with the fake event
            window.openTab(fakeEvent, tabParam);
        }
    }
    
    // Track initial visitor
    trackVisitor();
    loadVisitorStats();
    
    // Listen for tab changes
    document.addEventListener('tabChanged', (event) => {
        // Track visitor when tab changes
        trackVisitor();
    });

    // Add search functionality
    const searchInput = document.getElementById('visitor-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.getElementById('visitor-stats-body').getElementsByTagName('tr');
            
            Array.from(rows).forEach(row => {
                const ip = row.cells[0].textContent.toLowerCase();
                const userAgent = row.cells[1].textContent.toLowerCase();
                const page = row.cells[2].textContent.toLowerCase();
                const fingerprint = row.cells[3].getAttribute('title').toLowerCase();
                const timestamp = row.cells[4].textContent.toLowerCase();
                
                const matches = ip.includes(searchTerm) || 
                              userAgent.includes(searchTerm) || 
                              page.includes(searchTerm) ||
                              fingerprint.includes(searchTerm) ||
                              timestamp.includes(searchTerm);
                              
                row.style.display = matches ? '' : 'none';
            });
        });
    }
});

// Track visitor
async function trackVisitor() {
    try {
        // Get current page name
        const currentPage = getCurrentPageName();
        
        // Get fingerprint using the existing function from uuid.js
        const fingerprint = await getFingerprint();
        console.log('Sending fingerprint to server:', fingerprint); // Debug log
        
        const response = await fetch('https://api-utility.ninhtqse.site/track-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: await getClientIP(),
                userAgent: navigator.userAgent,
                page: currentPage,
                fingerprint: fingerprint
            })
        });
        const data = await response.json();
        if (!data.success) {
            console.error('Failed to track visitor');
        } else {
            console.log('Visitor tracked successfully'); // Debug log
        }
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Get current page name
function getCurrentPageName() {
    // Get the active tab
    const activeTab = document.querySelector('.nav-item.active');
    if (activeTab) {
        const spanElement = activeTab.querySelector('span');
        return spanElement ? spanElement.textContent : 'Unknown';
    }
    return 'Unknown';
}

// Get fingerprint using the existing function from uuid.js
async function getFingerprint() {
    try {
        // Create a simple fingerprint based on browser information
        const browserInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        // Convert browser info to string and hash it
        const browserInfoStr = JSON.stringify(browserInfo);
        const fingerprint = await hashString(browserInfoStr);
        console.log('Generated fingerprint:', fingerprint); // Debug log
        return fingerprint;
    } catch (error) {
        console.error('Fingerprint error:', error);
        return 'Unknown';
    }
}

// Helper function to hash a string
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Only take first 16 characters (8 bytes) of the hash
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get client IP
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error getting IP:', error);
        return 'Unknown';
    }
}

// Load visitor statistics
async function loadVisitorStats() {
    try {
        const response = await fetch('https://api-utility.ninhtqse.site/visitors');
        const visitors = await response.json();
        displayVisitors(visitors);
    } catch (error) {
        console.error('Error loading visitor stats:', error);
    }
}

// Display visitors in table
function displayVisitors(visitors) {
    const tbody = document.getElementById('visitor-stats-body');
    tbody.innerHTML = '';

    // Sort visitors by timestamp in descending order (newest first)
    visitors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    visitors.forEach(visitor => {
        const row = document.createElement('tr');
        const fingerprint = visitor.fingerprint || 'Unknown';
        row.innerHTML = `
            <td>${visitor.ip || 'Unknown'}</td>
            <td>${visitor.userAgent || 'Unknown'}</td>
            <td>${visitor.page || 'Unknown'}</td>
            <td title="${fingerprint}">${fingerprint.substring(0, 8)}${fingerprint.length > 8 ? '...' : ''}</td>
            <td>${new Date(visitor.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Search and sort functionality
document.getElementById('visitor-sort').addEventListener('change', function(e) {
    const tbody = document.getElementById('visitor-stats-body');
    const rows = Array.from(tbody.getElementsByTagName('tr'));
    
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[4].textContent);
        const dateB = new Date(b.cells[4].textContent);
        return e.target.value === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    rows.forEach(row => tbody.appendChild(row));
}); 