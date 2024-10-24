// Full script.js content for reference and correction
document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'https://dummyapi.online/api';
    const trendingMoviesList = document.getElementById('trending-movies-list');
    const searchBar = document.getElementById('search-bar');
    const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
    const movieDetailsContent = document.getElementById('movie-details-content');
    const watchlistContent = document.getElementById('watchlist-content');

    const homeSection = document.getElementById('home');
    const trendingMoviesSection = document.getElementById('trending-movies');
    const movieDetailsSection = document.getElementById('movie-details');
    const watchlistSection = document.getElementById('watchlist');

    const homeLink = document.getElementById('home-link');
    const trendingLink = document.getElementById('trending-link');
    const watchlistLink = document.getElementById('watchlist-link');
    const loginLink = document.getElementById('login-link');

    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    const fetchTrendingMovies = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/movies`);
            const data = await response.json();
            displayMovies(data, trendingMoviesList);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
        }
    };

    const searchMovies = async (query) => {
        try {
            const response = await fetch(`${apiBaseUrl}/movies`);
            const data = await response.json();
            const filteredMovies = data.filter(movie => movie.movie.toLowerCase().includes(query.toLowerCase()));
            displayMovies(filteredMovies, autocompleteSuggestions, true);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(`${apiBaseUrl}/movies`);
            const data = await response.json();
            const movie = data.find(movie => movie.id === movieId);
            displayMovieDetails(movie);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const displayMovies = (movies, container, isSearch = false) => {
        container.innerHTML = '';
        movies.forEach((movie, index) => {
            let imageNumber = 700 + index;
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="https://picsum.photos/${imageNumber}" alt="${movie.movie}">
                <h3>${movie.movie}</h3>
                <p>Rating: ${movie.rating}</p>
            `;
            movieCard.addEventListener('click', () => {
                fetchMovieDetails(movie.id);
                if (isSearch) autocompleteSuggestions.innerHTML = '';
            });
            container.appendChild(movieCard);
        });
    };

    const displayMovieDetails = (movie) => {
        movieDetailsContent.innerHTML = `
            <h3>${movie.movie}</h3>
            <img src="https://picsum.photos/700" alt="${movie.movie}">
            <p>Rating: ${movie.rating}</p>
            <a href="${movie.imdb_url}" target="_blank">View on IMDb</a>
            <button id="add-to-watchlist">Add to Watchlist</button>
        `;
        movieDetailsSection.classList.remove('hidden');
        homeSection.classList.add('hidden');
        trendingMoviesSection.classList.add('hidden');
        watchlistSection.classList.add('hidden');

        document.getElementById('add-to-watchlist').addEventListener('click', () => {
            addToWatchlist(movie);
        });
    };

    const displayWatchlist = () => {
        watchlistContent.innerHTML = '';
        watchlist.forEach((movie, index) => {
            let imageNumber = 700 + index;
            const watchlistCard = document.createElement('div');
            watchlistCard.className = 'watchlist-card';
            watchlistCard.innerHTML = `
                <img src="https://picsum.photos/${imageNumber}" alt="${movie.movie}">
                <h3>${movie.movie}</h3>
                <p>Rating: ${movie.rating}</p>
                <button class="remove-from-watchlist">Remove</button>
            `;
            watchlistCard.querySelector('.remove-from-watchlist').addEventListener('click', () => {
                removeFromWatchlist(movie.id);
            });
            watchlistContent.appendChild(watchlistCard);
        });
    };

    const addToWatchlist = (movie) => {
        if (!watchlist.find(item => item.id === movie.id)) {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            displayWatchlist();
        }
    };

    const removeFromWatchlist = (movieId) => {
        watchlist = watchlist.filter(movie => movie.id !== movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    };

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            searchMovies(query);
        } else {
            autocompleteSuggestions.innerHTML = '';
        }
    });

    homeLink.addEventListener('click', () => {
        homeSection.classList.remove('hidden');
        trendingMoviesSection.classList.add('hidden');
        movieDetailsSection.classList.add('hidden');
        watchlistSection.classList.add('hidden');
    });

    trendingLink.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        trendingMoviesSection.classList.remove('hidden');
        movieDetailsSection.classList.add('hidden');
        watchlistSection.classList.add('hidden');
        fetchTrendingMovies();
    });

    watchlistLink.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        trendingMoviesSection.classList.add('hidden');
        movieDetailsSection.classList.add('hidden');
        watchlistSection.classList.remove('hidden');
        displayWatchlist();
    });

    loginLink.addEventListener('click', () => {
        alert('Login functionality to be implemented');
    });

    fetchTrendingMovies();
    displayWatchlist();
});
