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
        categorias.add(eventos[i].category)
    }
    return (categorias);
}