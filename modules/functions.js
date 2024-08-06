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
                        <div class="card h-100 text-center" >
                            <img src=${evento.image} class="card-img-top" alt="...">
                            <div class="card-body">
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
        eventosFiltrados = eventos.filter(evento => new Date(evento.date) > new Date(fechaActual));
    } else if (filtro === "past_events") {
        eventosFiltrados = eventos.filter(evento => new Date(evento.date) < new Date(fechaActual));
    }

    pintarTarjetas(eventosFiltrados);
}