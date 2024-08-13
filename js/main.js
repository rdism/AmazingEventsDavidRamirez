import { obtenerData, pintarCategoriasParaChequear, filtrarEventos, filtrarEventosPorFecha } from '../modules/functions.js';


document.addEventListener("DOMContentLoaded", async () => {
    const data = await obtenerData('https://aulamindhub.github.io/amazing-api/events.json');
    if (data) {
        pintarCategoriasParaChequear(data.events);

        // Filtrar por fechaActual
        filtrarEventosPorFecha(data.currentDate, data.events, "all");

        document.getElementById("entradaBusqueda").addEventListener("keyup", () => filtrarEventos(data.events));
        document.getElementById('contenedorCheckboxes').addEventListener('change', () => filtrarEventos(data.events));
    }
});