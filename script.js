document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'https://dummyapi.online/api';
    const trendingMoviesList = document.getElementById('trending-movies-list');
    const searchBar = document.getElementById('search-bar');
    const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
    const movieDetailsContent = document.getElementById('movie-details-content');
    const watchlistContent = document.getElementById('watchlist-content');

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
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="https://picsum.photos/700" alt="${movie.movie}">
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
        document.getElementById('add-to-watchlist').addEventListener('click', () => {
            addToWatchlist(movie);
        });
    };

    const displayWatchlist = () => {
        watchlistContent.innerHTML = '';
        watchlist.forEach(movie => {
            const watchlistCard = document.createElement('div');
            watchlistCard.className = 'watchlist-card';
            watchlistCard.innerHTML = `
                <img src="https://picsum.photos/700" alt="${movie.movie}">
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

    fetchTrendingMovies();
    displayWatchlist();
});
