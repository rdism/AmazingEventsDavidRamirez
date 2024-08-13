import { obtenerData, generarStats } from "../modules/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const data = await obtenerData('https://aulamindhub.github.io/amazing-api/events.json');
    const contenedorTablas = document.getElementById("contenedorTablas");

    if (data) {
        const datatotal = data.events;
        const pasadosData = data.events.filter(event => event.date <= data.currentDate);
        const futurosData = data.events.filter(event => event.date > data.currentDate);

        const categoriasPastEvents = Array.from(new Set(pasadosData.map(item => item.category)));
        const categoriasUpcomingEvents = Array.from(new Set(futurosData.map(item => item.category)));

        contenedorTablas.appendChild(generarStats(datatotal, pasadosData, futurosData, categoriasPastEvents, categoriasUpcomingEvents));
    }
});

