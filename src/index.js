const baseApiUrl = 'http://localhost:3000';
const filmsUrl = `${baseApiUrl}/films`;
const ticketsUrl = `${baseApiUrl}/tickets`;

// Retrieve all films from the API and render them in the films menu
async function renderFilmsMenu() {
  const filmsMenu = document.querySelector('#films');

  try {
    const response = await fetch(filmsUrl);
    const filmsData = await response.json();

    // Remove placeholder li element from the menu
    filmsMenu.innerHTML = '';

    // Render each film in the menu
    filmsData.forEach(filmData => {
      const { id, title } = filmData;
      const filmItem = document.createElement('li');
      filmItem.classList.add('film', 'item');
      filmItem.dataset.filmId = id; // Set data-film-id attribute
      filmItem.textContent = title;
      filmItem.addEventListener('click', () => {
        renderFilmDetails(id);
      });
      filmsMenu.appendChild(filmItem);
    });
  } catch (error) {
    console.error('Error fetching films data', error);
  }
}

// Retrieve a film's details from the API and render them on the page
async function renderFilmDetails(filmId) {
  const filmDetails = document.querySelector('#showing');

  try {
    const response = await fetch(`${filmsUrl}/${filmId}`);
    const filmData = await response.json();

    // Clear existing film details
    filmDetails.innerHTML = '';

    // Render film poster
    const poster = document.createElement('img');
    poster.classList.add('ui', 'small', 'image');
    poster.src = filmData.poster;
    filmDetails.appendChild(poster);

    // Render film title
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = filmData.title;
    filmDetails.appendChild(title);

    // Render film runtime
    const runtime = document.createElement('div');
    runtime.classList.add('runtime');
    runtime.textContent = `${filmData.runtime} minutes`;
    filmDetails.appendChild(runtime);

    // Render film description
    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = filmData.description;
    filmDetails.appendChild(description);

    // Render film showtime
    const showtime = document.createElement('div');
    showtime.classList.add('showtime');
    showtime.textContent = `Showtime: ${filmData.showtime}`;
    filmDetails.appendChild(showtime);

    // Render film available tickets
    const availableTickets = filmData.capacity - filmData.tickets_sold;
    const tickets = document.createElement('div');
    tickets.classList.add('tickets');
    tickets.textContent = `${availableTickets} tickets remaining`;
    filmDetails.appendChild(tickets);

    // Render buy ticket button
    const buyTicketButton = document.createElement('button');
    buyTicketButton.classList.add('ui', 'orange', 'button');
    buyTicketButton.textContent = 'Buy Ticket';
    buyTicketButton.addEventListener('click', () => {
      buyTicket(filmId);
    });
    filmDetails.appendChild(buyTicketButton);

    // Update the film item in the films menu to indicate that it is not sold out
    const filmItem = document.querySelector(`#films .item[data-film-id="${filmId}"]`);
    filmItem.classList.remove('sold-out');
  } catch (error) {
    console.error('Error fetching film data', error);
  }
}

// Buy a ticket for a film and update the film's tickets_sold on the server
async function buyTicket(filmId) {
  try {
    const response = await fetch(`${filmsUrl}/${filmId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickets_sold: 1
      })
    });
    const updatedFilmData = await response.json();

    // Update available tickets count on the page
    const tickets = document.querySelector(`#showing .tickets`);
    tickets.textContent = `${updatedFilmData.capacity - updatedFilmData.tickets_sold} tickets remaining`;

    // Update buy ticket button text
    const buyTicketButton = document.querySelector(`#showing button`);
    buyTicketButton.textContent = 'Ticket Sold';
    buyTicketButton.disabled = true;

    // Update the film item in the films menu to indicate that it is sold out if there are no more available tickets
    const filmItem = document.querySelector(`#films .item[data-film-id="${filmId}"]`);
    if (updatedFilmData.capacity - updatedFilmData.tickets_sold === 0) {
      filmItem.classList.add('sold-out');
    }
  } catch (error) {
    console.error('Error buying ticket', error);
  }
}

// Delete a film from the server and remove it from the films menu
async function deleteFilm(filmId) {
  try {
    await fetch(`${filmsUrl}/${filmId}`, {
      method: 'DELETE'
    });

    // Remove the film item from the films menu
    const filmItem = document.querySelector(`#films .item[data-film-id="${filmId}"]`);
    filmItem.remove();
  } catch (error) {
    console.error('Error deleting film', error);
  }
}

// Render films menu and first film's details on page load
window.addEventListener('load', () => {
  renderFilmsMenu();
  renderFilmDetails(1);

  // Add delete buttons to each film in the films menu
  const filmsMenu = document.querySelector('#films');
  filmsMenu.querySelectorAll('.item').forEach(filmItem => {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('ui', 'red', 'button', 'delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const filmId = filmItem.dataset.filmId;
      deleteFilm(filmId);
    });
    filmItem.appendChild(deleteButton);
  });
});