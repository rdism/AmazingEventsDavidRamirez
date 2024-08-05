import { obtenerData, categoriasParaChequear } from './modules/functions.js';


document.addEventListener("DOMContentLoaded", async () => {
    const data = await obtenerData('https://aulamindhub.github.io/amazing-api/events.json');
    if (data) {
        pintarCategoriasParaChequear(data.events);
        pintarTarjetas(data.events);
        document.getElementById("entradaBusqueda").addEventListener("keyup", filtrarEventos);
        document.getElementById('contenedorCheckboxes').addEventListener('change', filtrarEventos);
    }
})

function pintarCategoriasParaChequear(eventos) {
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



function pintarTarjetas(eventos) {
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
        let tarjeta = document.createElement("div")
        tarjeta.className = "col col-xs-12 col-sm-6 col-md-3 p-2"
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
                    </div>`

        contenedor.appendChild(tarjeta);
    }
};

function filtrarEventos() {
    let entradaBusqueda = document.getElementById('entradaBusqueda').value.toLowerCase();
    let checkboxes = document.querySelectorAll('#contenedorCheckboxes input[type="checkbox"]:checked');
    let categoriasSeleccionadas = Array.from(checkboxes).map(checkbox => checkbox.nextElementSibling.innerText)

    let eventosFiltrados = data.events.filter((evento) => {
        let coincideCategoria = categoriasSeleccionadas.length == 0 || categoriasSeleccionadas.includes(evento.category);
        let coincideTexto = evento.name.toLowerCase().includes(entradaBusqueda);
        return coincideCategoria && coincideTexto
    })

    pintarTarjetas(eventosFiltrados);
}