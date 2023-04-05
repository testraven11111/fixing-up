import axios from 'axios';
import './style.css';

class Lib_movies extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.moviesDiv = document.createElement('div');
        this.shadowRoot.appendChild(this.moviesDiv);
        this.popup = document.createElement('div');
        this.popup.classList.add('popup');
        this.overviewContainer = document.createElement('div');
        this.overviewContainer.classList.add('overview-container');
        this.popup.appendChild(this.overviewContainer);
        this.shadowRoot.appendChild(this.popup);
       ;
    }

    connectedCallback() {
        
        axios.get('https://api.themoviedb.org/3/movie/popular?api_key=e74e5453a1c967b8e36b8763d65f06b9&language=en-US&page=1')
            .then(({ data: { results: movies } }) => {
                movies.forEach(({ id, title, poster_path: posterPath, overview }, index) => {
                    // Check if the movie element already exists in the moviesDiv
                    const movieDiv = this.shadowRoot.getElementById(`movie-${id}`);
                    if (movieDiv) {
                        return;
                    }

                    const newMovieDiv = document.createElement('div');
                    newMovieDiv.classList.add('movies');
                    newMovieDiv.id = `movie-${id}`;
                    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://via.placeholder.com/500x750.png?text=No+Image';
                    newMovieDiv.innerHTML = `
                        <h2>${title}</h2>
                        <div class="movie-content">
                        <img src="${posterUrl}" alt="${title} Poster">
                        <button class="show-overview-button">Show Overview</button>
                        <p class="overview">${overview}</p>
                        </div>
                    `;
                    const showOverviewButton = newMovieDiv.querySelector('.show-overview-button');
                    const overviewElement = newMovieDiv.querySelector('.overview');
                    showOverviewButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.overviewContainer.innerHTML = overview;
                        this.popup.style.display = 'block';
                        this.overviewContainer.classList.add('blur');

                        const closePopup = (e) => {
                            if (!this.popup.contains(e.target)) {
                                this.popup.style.display = 'none';
                                this.overviewContainer.classList.remove('blur');
                                document.removeEventListener('click', closePopup);
                            }
                        }

                        setTimeout(() => {
                            document.addEventListener('click', closePopup);
                        }, 100);
                    });

                    overviewElement.style.display = 'none';
                    this.moviesDiv.appendChild(newMovieDiv);
                    if (movies.length <= index + 1) {
                        return;
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

window.customElements.define('my-movies', Lib_movies);
