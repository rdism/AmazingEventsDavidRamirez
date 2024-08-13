import { obtenerData, mostrarDetallesEvento } from "../modules/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const data = await obtenerData('https://aulamindhub.github.io/amazing-api/events.json');
    if (data) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = parseInt(urlParams.get('id'));
        const eventDetails = data.events.find(event => event._id === eventId);
        
        mostrarDetallesEvento(eventDetails);
    }
});