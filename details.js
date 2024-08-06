import { obtenerData } from "./modules/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const data = await obtenerData('https://aulamindhub.github.io/amazing-api/events.json');
    if (data) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = parseInt(urlParams.get('id'));
        const eventDetails = data.events.find(event => event._id === eventId);
        
        mostrarDetallesEvento(eventDetails);
    }
});

// Voy a cambiar esta función para que modifique una tarjeta en el html
function mostrarDetallesEvento(evento) {
    const contenedor = document.getElementById('detalles');
    if (evento) {
        contenedor.innerHTML = `
            <div class="card mb-4">
                <img src="${evento.image}" class="card-img-top" alt="${evento.name}">
                <div class="card-body">
                    <h5 class="card-title">${evento.name}</h5>
                    <p class="card-text">${evento.description}</p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Date:</strong> ${evento.date}</li>
                        <li class="list-group-item"><strong>Category:</strong> ${evento.category}</li>
                        <li class="list-group-item"><strong>Place:</strong> ${evento.place}</li>
                        <li class="list-group-item"><strong>Capacity:</strong> ${evento.capacity}</li>
                        <li class="list-group-item"><strong>Price:</strong> $${evento.price}</li>
                    </ul>
                </div>
            </div>`;
    } else {
        contenedor.innerHTML = `<p>Event not found.</p>`;
    }
}
