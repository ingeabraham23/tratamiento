// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import "./EditarReceta.css"

const EditarRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [recetaId, setRecetaId] = useState("");
  const [receta, setReceta] = useState({
    pacienteNombre: "",
    doctorNombre: "",
    consultorioDireccion: "",
    medicamentos: [],
  });

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      const recetasFromDB = await db.recetas.toArray();
      setRecetas(recetasFromDB);
    } catch (error) {
      console.error("Error al cargar las recetas:", error);
    }
  };

  const cargarDatosReceta = async () => {
    try {
      const recetaEncontrada = await db.recetas.get(parseInt(recetaId, 10));

      if (recetaEncontrada) {
        setReceta({
          pacienteNombre: recetaEncontrada.pacienteNombre,
          doctorNombre: recetaEncontrada.doctorNombre,
          consultorioDireccion: recetaEncontrada.consultorioDireccion,
          medicamentos: recetaEncontrada.medicamentos || [],
        });
      }
    } catch (error) {
      console.error("Error al cargar datos de la receta:", error);
    }
  };

  const actualizarReceta = async () => {
    try {
      await db.recetas.update(parseInt(recetaId, 10), {
        pacienteNombre: receta.pacienteNombre,
        doctorNombre: receta.doctorNombre,
        consultorioDireccion: receta.consultorioDireccion,
        medicamentos: receta.medicamentos,
      });

      // Limpiar el formulario después de la actualización
      setRecetaId("");
      setReceta({
        pacienteNombre: "",
        doctorNombre: "",
        consultorioDireccion: "",
        medicamentos: [],
      });
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setRecetaId(selectedId);
  };

  const handleEditarClick = () => {
    if (recetaId) {
      cargarDatosReceta();
    }
  };

  return (
    <div>
      <div className="contenedor-inputs-receta">
        <h2>Editar Receta</h2>
          <select value={recetaId} onChange={handleSelectChange}>
            <option value="">Selecciona una receta</option>
            {recetas.map((receta) => (
              <option key={receta.id} value={receta.id}>
                {receta.pacienteNombre} - {receta.doctorNombre}
              </option>
            ))}
          </select>
        <button onClick={handleEditarClick} className="boton-editar">
          Editar Receta
        </button>
          <input
          placeholder="Nombre del Paciente"
            type="text"
            value={receta.pacienteNombre}
            onChange={(e) =>
              setReceta({ ...receta, pacienteNombre: e.target.value })
            }
          />
          <input
          placeholder="Nombre del Doctor"
            type="text"
            value={receta.doctorNombre}
            onChange={(e) =>
              setReceta({ ...receta, doctorNombre: e.target.value })
            }
          />
          <input
          placeholder="Dirección del Consultorio"
            type="text"
            value={receta.consultorioDireccion}
            onChange={(e) =>
              setReceta({ ...receta, consultorioDireccion: e.target.value })
            }
          />
        <button onClick={actualizarReceta} className="boton-actualizar">
          Actualizar Receta
        </button>
      </div>
      <hr></hr>
    </div>
  );
};

export default EditarRecetas;
