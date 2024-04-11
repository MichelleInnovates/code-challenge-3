

document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/films'
const title = document.querySelector('#title')
        const runtime = document.querySelector('#runtime')
        const showtime = document.querySelector('#showtime')
        const description = document.querySelector('#film-info')
        const poster = document.querySelector('#poster')
        const ticketsLeft = document.querySelector('#ticket-num')

    fetchmovies()
    function fetchmovies() {

        fetch('http://localhost:3000/films', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
    
        })
            .then((res) => res.json())
            .then((movies) => {
                movies.forEach(movie => {
                    showMovie(movie)
                });
            })
            .catch((err) => console.log(err))
    
    }
    function showMovie(movie) {
        const films = document.querySelector('#films')
        const film = document.createElement('li')
        film.className = 'film item'
        film.textContent = movie.title
        film.id = movie.id
        films.appendChild(film)
        displayMovie(movie)
    }
    function displayMovie(movie) {
        const displayButton = document.getElementById(movie.id)
        displayButton.addEventListener('click', () => {
            
            ticketsLeft.textContent = movie.capacity - movie.tickets_sold
            title.textContent = movie.title
            runtime.textContent = movie.runtime
            showtime.textContent = movie.showtime
            description.textContent = movie.description
            poster.src = movie.poster
    
        })
    
    }
})

