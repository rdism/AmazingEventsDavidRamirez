export async function obtenerData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los eventos", error);
    }
}

export function categoriasParaChequear(eventos) {
    let categorias = new Set();
    for (let i = 0; i < eventos.length; i++) {
        categorias.add(eventos[i].category);
    }
    return (categorias);
}

export function pintarCategoriasParaChequear(eventos) {
    let contCheckbox = document.getElementById("contenedorCheckboxes");
    let categorias = categoriasParaChequear(eventos);
    let btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";
    btnGroup.role = "group";

    let i = 0;
    categorias.forEach((categoria) => {
        let inputCheckbox = document.createElement('input');
        inputCheckbox.type = "checkbox";
        inputCheckbox.className = "form-check-input btn-check";
        inputCheckbox.id = `flexCheck${i}`;

        let labelCheckbox = document.createElement('label');
        labelCheckbox.className = "btn btn-primary";
        labelCheckbox.setAttribute("for", `flexCheck${i}`);
        labelCheckbox.innerText = categoria;

        btnGroup.appendChild(inputCheckbox);
        btnGroup.appendChild(labelCheckbox);
        i++;
    });
    contCheckbox.appendChild(btnGroup);
}

export function pintarTarjetas(eventos) {
    let contenedor = document.getElementById("contenedorTarjetas");
    contenedor.innerHTML = '';

    if (eventos.length === 0) {
        let mensaje = document.createElement("div");
        mensaje.className = "alert alert-warning text-center";
        mensaje.textContent = "No hay eventos para mostrar.";
        contenedor.appendChild(mensaje);
        return;
    }

    for (let i = 0; i < eventos.length; i++) {
        let evento = eventos[i];
        let tarjeta = document.createElement("div");
        tarjeta.className = "col col-xs-12 col-sm-6 col-md-3 p-2";
        tarjeta.innerHTML = `
                    <div id="tarjetas">
                        <div class="card  text-center" >
                            <img src=${evento.image} class="card-img-top mb-auto" alt="...">
                            <div class="card-body mt-auto">
                                <h5 class="card-title ">${evento.name}</h5>
                                <p class="card-text ">${evento.description}</p>
                                <div class="row">
                                    <div class="col-6"><a>$${evento.price}</a></div>
                                    <div class="col-6"> <a href="details.html?id=${evento._id}"
                                            class="btn btn-primary ms-auto">Details</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

        contenedor.appendChild(tarjeta);
    }
}

export function filtrarEventos(eventos) {
    let entradaBusqueda = document.getElementById('entradaBusqueda').value.toLowerCase();
    let checkboxes = document.querySelectorAll('#contenedorCheckboxes input[type="checkbox"]:checked');
    let categoriasSeleccionadas = Array.from(checkboxes).map(checkbox => checkbox.nextElementSibling.innerText);

    let eventosFiltrados = eventos.filter((evento) => {
        let coincideCategoria = categoriasSeleccionadas.length == 0 || categoriasSeleccionadas.includes(evento.category);
        let coincideTexto = evento.name.toLowerCase().includes(entradaBusqueda);
        return coincideCategoria && coincideTexto;
    });

    pintarTarjetas(eventosFiltrados);
}

export function filtrarEventosPorFecha(fechaActual, eventos, filtro) {
    let eventosFiltrados = [];

    if (filtro === "all") {
        eventosFiltrados = eventos;
    } else if (filtro === "upcoming_events") {
        eventosFiltrados = eventos.filter(evento => evento.date > fechaActual);
    } else if (filtro === "past_events") {
        eventosFiltrados = eventos.filter(evento => evento.date < fechaActual);
    }

    pintarTarjetas(eventosFiltrados);
}

export function mostrarDetallesEvento(evento) {
    const contenedor = document.getElementById('detalles');
    if (evento) {
        contenedor.innerHTML = `
            <div class="card mb-4 shadow-sm mx-auto">
                <img src="${evento.image}" class="card-img-top" alt="${evento.name}" >
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

function calcularMayor(eventos) {
    let porcentaje = 0;
    let title = "";
    let asistencia = 0;
    let capacidad = 0;

    eventos.forEach(evento => {
        const numero = (evento.assistance / evento.capacity) * 100;
        if (numero > porcentaje) {
            porcentaje = numero;
            title = evento.name;
            asistencia = evento.assistance;
            capacidad = evento.capacity;
        }
    });

    return `The largest is ${title} with ${porcentaje.toFixed(2)}% attendance, (${asistencia} over ${capacidad})`;
}

function calcularMenor(eventos) {
    let porcentaje = 100;
    let title = "";
    let asistencia = 0;
    let capacidad = 0;

    eventos.forEach(evento => {
        const numero = (evento.assistance / evento.capacity) * 100;
        if (numero < porcentaje) {
            porcentaje = numero;
            title = evento.name;
            asistencia = evento.assistance;
            capacidad = evento.capacity;
        }
    });

    return `The lowest is ${title} with ${porcentaje}% attendance (${asistencia} over ${capacidad})`;
}

function mayorCapacidad(eventos) {
    let mayor = 0;
    let title = "";

    eventos.forEach(evento => {
        if (evento.capacity > mayor) {
            mayor = evento.capacity;
            title = evento.name;
        }
    });

    return `The largest is ${title} with a capacity of ${mayor}`;
}

function infoPastEventsPorcategorias(categorias, eventos) {
    const array = [];
    categorias.forEach(categoria => {
        const catEvents = eventos.filter(evento => categoria === evento.category);
        const ingresos = catEvents.reduce(
            (acum, evento) => acum + evento.price * (evento.estimate || evento.assistance), 0
        );
        const attendance = catEvents.reduce(
            (acum, event) => acum + ((event.assistance || event.estimate) / event.capacity) * 100, 0
        );
        const ingresosPromedio = ingresos / catEvents.length;
        array.push({
            categoria,
            ingresos,
            ingresosPromedio,
            attendance: attendance / catEvents.length,
        });
    });
    return array;
}

function infoUpcomingEventsPorcategorias(categorias, eventos) {
    const array = [];
    categorias.forEach(category => {
        const catEvents = eventos.filter(event => category === event.category);
        const ingresos = catEvents.reduce(
            (acum, event) => acum + event.price * (event.estimate || event.assistance), 0
        );
        const attendance = catEvents.reduce(
            (acum, event) => acum + ((event.assistance || event.estimate) / event.capacity) * 100, 0
        );
        const ingresosPromedio = ingresos / catEvents.length;
        array.push({
            category,
            ingresos,
            ingresosPromedio,
            attendance: attendance / catEvents.length,
        });
    });
    return array;
}

export function generarStats(datatotal, pasadosData, futurosData, categoriasPastEvents, categoriasUpcomingEvents) {
    const contenedor = document.createElement('div');
    contenedor.className = 'container';

    const tableResponsive = document.createElement('div');
    tableResponsive.className = 'table-responsive';

    const table = document.createElement('table');
    table.className = 'table table-hover table-hover-custom table-striped caption-top rounded-table';
    table.innerHTML = `
        <thead class="table-dark">
            <tr><th colspan="3" class="text-center text-white fw-medium">Events Statistics</th></tr>
            <tr>
                <th class="fw-semibold">Event with the highest percentage of attendance</th>
                <th class="fw-semibold">Event with the lowest percentage of attendance</th>
                <th class="fw-semibold">Event with larger capacity</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${calcularMayor(pasadosData)}</td>
                <td>${calcularMenor(pasadosData)}</td>
                <td>${mayorCapacidad(datatotal)}</td>
            </tr>
        </tbody>`;

    tableResponsive.appendChild(table);

    const tableUpcoming = document.createElement('table');
    const tbodyTableUpcoming = document.createElement('tbody');
    tableUpcoming.className = 'table table-hover table-hover-custom table-striped caption-top rounded-table';
    tableUpcoming.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th colspan="4" class="text-center text-white fw-medium">Upcoming events statistics</th>
            </tr>
            <tr>
                <th class="fw-semibold">Categories</th>
                <th class="fw-semibold">Revenues</th>
                <th class="fw-semibold">Average Income</th>
                <th class="fw-semibold">Attendance</th>
            </tr>
        </thead>`;

    infoUpcomingEventsPorcategorias(categoriasUpcomingEvents, futurosData).forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${event.category}</td>
            <td>$ ${event.ingresos.toLocaleString('es-AR')}</td>
            <td>$ ${event.ingresosPromedio.toLocaleString('es-AR')}</td>
            <td>${event.attendance.toFixed(2)} %</td>`;
        tbodyTableUpcoming.appendChild(tr);
    });

    tableUpcoming.appendChild(tbodyTableUpcoming);
    const tableUpcomingResponsive = document.createElement('div');
    tableUpcomingResponsive.className = 'table-responsive';
    tableUpcomingResponsive.appendChild(tableUpcoming);

    const tablePast = document.createElement('table');
    const tbodyTablePast = document.createElement('tbody');
    tablePast.className = 'table table-hover table-hover-custom table-striped caption-top rounded-table';
    tablePast.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th colspan="4" class="text-center text-white fw-medium">Past Events Statistics</th>
            </tr>
            <tr>
                <th class="fw-semibold">Categories</th>
                <th class="fw-semibold">Revenues</th>
                <th class="fw-semibold">Average Income</th>
                <th class="fw-semibold">Attendance</th>
            </tr>
        </thead>`;

    infoPastEventsPorcategorias(categoriasPastEvents, pasadosData).forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${event.categoria}</td>
            <td>$ ${event.ingresos.toLocaleString('es-AR')}</td>
            <td>$ ${event.ingresosPromedio.toLocaleString('es-AR')}</td>
            <td>${event.attendance.toFixed(2)} %</td>`;
        tbodyTablePast.appendChild(tr);
    });

    tablePast.appendChild(tbodyTablePast);
    const tablePastResponsive = document.createElement('div');
    tablePastResponsive.className = 'table-responsive';
    tablePastResponsive.appendChild(tablePast);

    contenedor.append(tableResponsive, tableUpcomingResponsive, tablePastResponsive);
    return contenedor;
}