// ===== Configuración inicial =====
const CLAVE = "alergiasComunes"; // clave con la que se guarda en localStorage
// Lista inicial que aparece la primera vez que se abre la página
const INICIALES = [
    { nombre: "Polen", descripcion: "Provoca estornudos, picazón en los ojos y nariz tapada, sobre todo en primavera." },
    { nombre: "Ácaros del polvo", descripcion: "Pequeños bichos del polvo doméstico que causan congestión y tos." },
    { nombre: "Maní", descripcion: "Alergia a un alimento que puede causar ronchas, hinchazón y dificultad para respirar." },
    { nombre: "Pelo de animales", descripcion: "Reacción a la caspa de gatos o perros: estornudos y ojos llorosos." },
    { nombre: "Penicilina", descripcion: "Alergia a un antibiótico que puede causar erupciones en la piel." }
];
let lista = []; // aquí vive la lista actual de alergias
// ===== Referencias a elementos del HTML =====
const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const mensaje = document.getElementById("mensaje");
const buscador = document.getElementById("buscador");
const contador = document.getElementById("contador");
const ul = document.getElementById("lista");
const vacio = document.getElementById("vacio");
// ===== Funciones de localStorage =====
// Lee la lista guardada; si no hay nada, usa la lista inicial
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        lista = guardado ? JSON.parse(guardado) : INICIALES.slice();
    } catch (error) {
      lista = INICIALES.slice(); // si algo falla, vuelve a la lista inicial
    }
}
// Guarda la lista como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
// ===== Función que dibuja la lista en pantalla =====
function pintarLista() {
    const texto = buscador.value.trim().toLowerCase();
    ul.innerHTML = ""; // limpia la lista antes de dibujar
    let mostradas = 0;
    lista.forEach(function (alergia, posicion) {
        // Si lo escrito en el buscador no coincide, se salta esta alergia
        if (!alergia.nombre.toLowerCase().includes(texto)) return;
        mostradas++;
        const li = document.createElement("li");
        li.className = "alergia";
        // Bloque de texto con título y descripción (textContent evita código malicioso)
        const info = document.createElement("div");
        const titulo = document.createElement("h3");
        const detalle = document.createElement("p");
        titulo.textContent = alergia.nombre;
        detalle.textContent = alergia.descripcion;
        info.append(titulo, detalle);
        // Botón para eliminar; guarda la posición en data-posicion
        const boton = document.createElement("button");
        boton.className = "btn-eliminar";
        boton.textContent = "Eliminar";
        boton.dataset.posicion = posicion;
        li.append(info, boton);
        ul.appendChild(li);
    });
    contador.textContent = mostradas + " de " + lista.length + " alergias";
    vacio.classList.toggle("oculto", mostradas > 0); // muestra el aviso si no hay resultados
}
// ===== Eventos =====
// Agregar una alergia nueva
document.getElementById("btnAgregar").addEventListener("click", function () {
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    // Validación: los dos campos son obligatorios
    if (!nombre || !descripcion) {
        mensaje.textContent = "Escribe el nombre y la descripción.";
        return;
    }
    lista.push({ nombre: nombre, descripcion: descripcion });
    guardarDatos();
    inputNombre.value = "";
    inputDescripcion.value = "";
    mensaje.textContent = "";
    pintarLista();
});
// Eliminar: un solo evento en la lista detecta el botón pulsado
ul.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
        lista.splice(Number(e.target.dataset.posicion), 1); // quita esa alergia
        guardarDatos();
        pintarLista();
    }
});
// Buscar: vuelve a dibujar la lista cada vez que se escribe
buscador.addEventListener("input", pintarLista);
// Restaurar la lista inicial (pide confirmación)
document.getElementById("btnRestaurar").addEventListener("click", function () {
    if (confirm("¿Volver a la lista inicial? Se borrarán tus cambios.")) {
        lista = INICIALES.slice();
        guardarDatos();
        pintarLista();
    }
});
// ===== Inicio de la app =====
cargarDatos(); // primero se lee lo guardado
pintarLista(); // luego se dibuja la pantalla