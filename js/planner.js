document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check
    const user = localStorage.getItem('travelUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('welcome-user').textContent = `Hi, ${user}!`;

    // 2. Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('travelUser');
        window.location.href = 'index.html';
    });

    // 3. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    themeBtn.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        document.getElementById('theme-icon').textContent = isDark ? '🌙' : '☀️';
    });

    // 4. Load Recent Searches when page opens
    loadRecentSearches();
});

// --- RECENT SEARCHES LOGIC ---
function loadRecentSearches() {
    const user = localStorage.getItem('travelUser');
    if (!user) return;

    const storageKey = `recentSearches_${user}`;
    const searches = JSON.parse(localStorage.getItem(storageKey)) || [];
    const container = document.getElementById('recent-searches-container');
    const section = document.getElementById('recent-searches-section');

    // Deduplication: Ensuring unique destinations
    const uniqueSearches = [];
    const seen = new Set();
    
    searches.forEach(s => {
        const destLower = s.dest.toLowerCase().trim();
        if (!seen.has(destLower)) {
            seen.add(destLower);
            uniqueSearches.push(s);
        }
    });

    if (uniqueSearches.length > 0) {
        section.style.display = 'block';
        container.innerHTML = '';
        
        uniqueSearches.slice(0, 4).forEach(search => {
            const btn = document.createElement('button');
            btn.className = "btn-secondary";
            btn.style.padding = "8px 16px";
            btn.style.fontSize = "0.9rem";
            btn.style.borderRadius = "20px";
            btn.style.background = "var(--card-bg)";
            btn.style.backdropFilter = "blur(10px)";
            
            btn.innerHTML = `📍 ${search.dest}`;
            
            // Auto-fill form on click
            btn.addEventListener('click', () => {
                document.getElementById('origin').value = search.origin;
                document.getElementById('destination').value = search.dest;
                if(document.getElementById('category')) {
                    document.getElementById('category').value = search.category || 'Solo Traveler';
                }
                // Cursor automatically goes to 'Days' so user knows what to fill next
                document.getElementById('days').focus();
            });
            container.appendChild(btn);
        });
    } else {
        section.style.display = 'none';
    }
}

// --- FORM SUBMISSION & API CALL LOGIC ---
const form = document.getElementById('travel-form');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const content = document.getElementById('itinerary-content');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading spinner
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    content.innerHTML = '';

    // Collect all data including the new Category field
    const data = {
        origin: document.getElementById('origin').value.trim(),
        dest: document.getElementById('destination').value.trim(),
        days: document.getElementById('days').value,
        budget: document.getElementById('budget').value,
        interests: document.getElementById('interests').value,
        category: document.getElementById('category').value
    };

    // Save to Local Storage with Smart Deduplication
    const user = localStorage.getItem('travelUser');
    if (user) {
        const storageKey = `recentSearches_${user}`;
        let searches = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // Find if this destination was already searched
        const existingIndex = searches.findIndex(s => s.dest.toLowerCase() === data.dest.toLowerCase());
        
        if (existingIndex !== -1) {
            // Remove it from old position
            searches.splice(existingIndex, 1);
        }
        
        // Add to the top (most recent)
        searches.unshift({ origin: data.origin, dest: data.dest, category: data.category });
        searches = searches.slice(0, 4); // Keep only top 4
        
        localStorage.setItem(storageKey, JSON.stringify(searches));
        loadRecentSearches();
    }

    // Call Backend API
    try {
        const response = await fetch('http://localhost:5000/api/generate-itinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            content.innerHTML = result.itineraryHTML;
            // Scroll down smoothly to show the result
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            content.innerHTML = `<p style="color:red; font-weight:bold; text-align:center; padding:20px;">Backend Error: ${result.error}</p>`;
        }
        
        loading.classList.add('hidden');
        results.classList.remove('hidden');

    } catch (err) {
        console.error("Fetch Error:", err);
        loading.classList.add('hidden');
        results.classList.remove('hidden');
        content.innerHTML = `<p style="color:red; font-weight:bold; text-align:center; padding: 20px;">Server connection failed. Make sure your Node.js server is running!</p>`;
    }
});