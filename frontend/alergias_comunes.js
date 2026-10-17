//------------------------------------//
//--|funcionalidad_alergias_comunes|--//
//------------------------------------//
const CLAVE = "alergiasComunes";
const INICIALES = [
    {
        nombre: "Polen",
        descripcion: "Provoca estornudos, picazón en los ojos y nariz tapada, sobre todo en primavera."
    },
    {
        nombre: "Ácaros del polvo",
        descripcion: "Pequeños bichos del polvo doméstico que causan congestión y tos."
    },
    {
        nombre: "Maní",
        descripcion: "Alergia a un alimento que puede causar ronchas, hinchazón y dificultad para respirar."
    },
    {
        nombre: "Pelo de animales",
        descripcion: "Reacción a la caspa de gatos o perros: estornudos y ojos llorosos."
    },
    {
        nombre: "Penicilina",
        descripcion: "Alergia a un antibiótico que puede causar erupciones en la piel."
    }
];
let lista = [];
const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const mensaje = document.getElementById("mensaje");
const buscador = document.getElementById("buscador");
const contador = document.getElementById("contador");
const ul = document.getElementById("lista");
const vacio = document.getElementById("vacio");
//----------------------------//
//--|cargar_datos_guardados|--//
//----------------------------//
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        lista = guardado ? JSON.parse(guardado) : INICIALES.slice();
    } catch (error) {
        lista = INICIALES.slice();
    }
}
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
//----------------------------------------//
//--|mostrar_lista_de_alergias|--//
//----------------------------------------//
function pintarLista() {
    const texto = buscador.value.trim().toLowerCase();
    ul.innerHTML = "";
    let mostradas = 0;
    lista.forEach(function(alergia, posicion) {
        if (!alergia.nombre.toLowerCase().includes(texto)) {
            return;
        }
        mostradas++;
        const li = document.createElement("li");
        li.className = "alergia";
        const info = document.createElement("div");
        const titulo = document.createElement("h3");
        const detalle = document.createElement("p");
        titulo.textContent = alergia.nombre;
        detalle.textContent = alergia.descripcion;
        info.append(titulo, detalle);
        const boton = document.createElement("button");
        boton.className = "btn-eliminar";
        boton.textContent = "Eliminar";
        boton.dataset.posicion = posicion;
        li.append(info, boton);
        ul.appendChild(li);
    });
    contador.textContent = mostradas + " de " + lista.length + " alergias";
    vacio.classList.toggle("oculto", mostradas > 0);
}
//--------------------------------------//
//--|agregar_y_eliminar_nueva_alergia|--//
//--------------------------------------//
document.getElementById("btnAgregar").addEventListener("click", function() {
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    if (!nombre || !descripcion) {
        mensaje.textContent = "Escribe el nombre y la descripción.";
        return;
    }
    lista.push({
        nombre: nombre,
        descripcion: descripcion
    });
    guardarDatos();
    inputNombre.value = "";
    inputDescripcion.value = "";
    mensaje.textContent = "";
    pintarLista();
});
ul.addEventListener("click", function(evento) {
    if (evento.target.classList.contains("btn-eliminar")) {
        const posicion = Number(evento.target.dataset.posicion);
        lista.splice(posicion, 1);
        guardarDatos();
        pintarLista();
    }
});
buscador.addEventListener("input", pintarLista);
//-----------------------------//
//--|restaurar_lista_inicial|--//
//-----------------------------//
document.getElementById("btnRestaurar").addEventListener("click", function() {
    if (confirm("¿Volver a la lista inicial? Se borrarán tus cambios.")) {
        lista = INICIALES.slice();
        guardarDatos();
        pintarLista();
    }
});
//------------------------//
//--|iniciar_aplicacion|--//
//------------------------//
cargarDatos();
pintarLista();