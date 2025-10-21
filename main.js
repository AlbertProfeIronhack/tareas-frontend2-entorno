const API_URL = "https://disturbing-florie-albertironhack-4fbc703a.koyeb.app/api/tareas";

async function obtenerTareas() {
  const res = await fetch(API_URL);
  const tareas = await res.json();
  mostrarTareas(tareas);
}

function mostrarTareas(tareas) {
  const contenedor = document.getElementById("lista-tareas");
  contenedor.innerHTML = "";

  tareas.forEach((tarea) => {
    const div = document.createElement("div");
    div.className = "tarea" + (tarea.completado ? " completado" : "");
    div.innerHTML = `
          <h3>${tarea.titulo}</h3>
          <p>${tarea.descripcion}</p>
          <p><strong>Completado:</strong> ${tarea.completado ? "✅" : "❌"}</p>
          <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
          <button onclick="marcarCompletado(${tarea.id}, ${
      tarea.completado
    })">Marcar como ${tarea.completado ? "incompleta" : "completada"}</button>
        `;
    contenedor.appendChild(div);
  });
}

async function crearTarea(titulo, descripcion) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion, completado: false }),
  });
  obtenerTareas();
}

async function eliminarTarea(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  obtenerTareas();
}

async function marcarCompletado(id, estadoActual) {
  const res = await fetch(`${API_URL}/${id}`);
  const tarea = await res.json();

  tarea.completado = !estadoActual;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarea),
  });

  obtenerTareas();
}

document
  .getElementById("formulario-tarea")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    crearTarea(titulo, descripcion);
    e.target.reset();
  });

// Cargar tareas al inicio
obtenerTareas();
