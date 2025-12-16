// Load books when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadNewArrivals();
    loadFeatured();
    setupSearch();
});

// Load New Arrivals
async function loadNewArrivals() {
    try {
        const response = await fetch('/api/books/new-arrivals');
        const books = await response.json();
        
        const container = document.getElementById('newArrivals');
        container.innerHTML = books.map(book => createBookCard(book)).join('');
    } catch (error) {
        console.error('Error loading new arrivals:', error);
    }
}

// Load Featured Books
async function loadFeatured() {
    try {
        const response = await fetch('/api/books/featured');
        const books = await response.json();
        
        const container = document.getElementById('featured');
        container.innerHTML = books.map(book => createBookCard(book)).join('');
    } catch (error) {
        console.error('Error loading featured books:', error);
    }
}

// Create Book Card HTML
function createBookCard(book) {
    return `
        <div class="book-card">
            <img src="${book.image_url}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-price">$${book.price.toFixed(2)}</div>
            </div>
        </div>
    `;
}

// Setup Search Functionality
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform Search
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) {
        // If search is empty, reload original content
        loadNewArrivals();
        loadFeatured();
        document.getElementById('newArrivals').parentElement.querySelector('.section-title').textContent = 'New Arrivals';
        document.getElementById('featured').parentElement.querySelector('.section-title').textContent = 'Featured';
        return;
    }

    try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
        const books = await response.json();

        // Hide original sections and show search results
        const newArrivalsSection = document.getElementById('newArrivals');
        const featuredSection = document.getElementById('featured');
        
        if (books.length > 0) {
            // Show results in new arrivals section
            newArrivalsSection.parentElement.querySelector('.section-title').textContent = 'Search Results';
            newArrivalsSection.innerHTML = books.map(book => createBookCard(book)).join('');
            
            // Hide featured section
            featuredSection.parentElement.querySelector('.section-title').style.display = 'none';
            featuredSection.style.display = 'none';
        } else {
            newArrivalsSection.parentElement.querySelector('.section-title').textContent = 'Search Results';
            newArrivalsSection.innerHTML = '<p class="no-results">No books found matching your search.</p>';
            
            // Hide featured section
            featuredSection.parentElement.querySelector('.section-title').style.display = 'none';
            featuredSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Error searching books:', error);
    }
}

// Clear search when input is cleared
document.getElementById('searchInput').addEventListener('input', (e) => {
    if (e.target.value === '') {
        loadNewArrivals();
        loadFeatured();
        
        // Show all sections again
        document.getElementById('newArrivals').parentElement.querySelector('.section-title').textContent = 'New Arrivals';
        document.getElementById('featured').parentElement.querySelector('.section-title').textContent = 'Featured';
        document.getElementById('featured').parentElement.querySelector('.section-title').style.display = 'block';
        document.getElementById('featured').style.display = 'flex';
    }
});