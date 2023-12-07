// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import db from "../db";
import EditarMedicamentos from "./EditarMedicamentos";
import "./Medicamentos.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Medicamentos = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dosis, setDosis] = useState("");
  const [sirvePara, setSirvePara] = useState("");
  const [horaDosis1, setHoraDosis1] = useState("");
  const [horaDosis2, setHoraDosis2] = useState("");
  const [horaDosis3, setHoraDosis3] = useState("");
  const [horaDosis4, setHoraDosis4] = useState("");

  const agregarMedicamento = async () => {
    try {
      // Validaciones (puedes agregar más según tus necesidades)
      if (!nombre || !descripcion || !dosis) {
        toast.warn("Todos los campos son obligatorios.");
      }
      // Agrega el medicamento a la base de datos con horarios de dosis
      await db.medications.add({
        nombre,
        descripcion,
        dosis,
        sirvePara,
        horasDeDosis: [horaDosis1, horaDosis2, horaDosis3, horaDosis4].filter(
          Boolean
        ), // Filtra los horarios no seleccionados
      });

      // Feedback al usuario (puedes personalizar el mensaje)
      toast.success("Medicamento agregado exitosamente.");

      // Limpia los estados después de agregar
      setNombre("");
      setDescripcion("");
      setDosis("");
      setSirvePara("");
      setHoraDosis1("");
      setHoraDosis2("");
      setHoraDosis3("");
      setHoraDosis4("");
    } catch (error) {
      console.error("Error al agregar el medicamento:", error.message);
      // Puedes proporcionar feedback específico al usuario si ocurre un error
      toast.error(
        "Hubo un error al agregar el medicamento. Por favor, verifica los campos."
      );
    }
  };

  // Genera las opciones de horas en intervalos de 30 minutos
  const generarOpcionesDeHoras = () => {
    const intervaloDeHoras = 30;
    const horasDelDia = 24 * 60; // Total de minutos en un día

    const opcionesDeHoras = [];
    for (let i = 0; i < horasDelDia; i += intervaloDeHoras) {
      const horas = Math.floor(i / 60)
        .toString()
        .padStart(2, "0");
      const minutos = (i % 60).toString().padStart(2, "0");
      opcionesDeHoras.push(`${horas}:${minutos}`);
    }

    return opcionesDeHoras;
  };

  const opcionesDeHoras = generarOpcionesDeHoras();

  return (
    <div>
      <div className="contenedor-inputs">
        <h2>Agregar Medicamento</h2>
        <input
          type="text"
          placeholder="Nombre del Medicamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <br />
        <textarea
          rows={4}
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <br />
        <textarea
          rows={4}
          value={dosis}
          placeholder="Dosis"
          onChange={(e) => setDosis(e.target.value)}
        />
        <br />

        <textarea
          rows={4}
          placeholder="¿Para que sirve?"
          value={sirvePara}
          onChange={(e) => setSirvePara(e.target.value)}
        />
        <br />
        <div className="contenedor-dosis">
          <select
            value={horaDosis1}
            onChange={(e) => setHoraDosis1(e.target.value)}
          >
            <option value="">Horario primera dosis</option>
            {opcionesDeHoras.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          <br></br>
          <select
            value={horaDosis2}
            onChange={(e) => setHoraDosis2(e.target.value)}
          >
            <option value="">Horario segunda dosis</option>
            {opcionesDeHoras.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          <br />
          <select
            value={horaDosis3}
            onChange={(e) => setHoraDosis3(e.target.value)}
          >
            <option value="">Horario tercer dosis</option>
            {opcionesDeHoras.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          <br />
          <select
            value={horaDosis4}
            onChange={(e) => setHoraDosis4(e.target.value)}
          >
            <option value="">Horario cuarta dosis</option>
            {opcionesDeHoras.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>
        <br />
        <button onClick={agregarMedicamento} className="boton-guardar">
          Guardar Medicamento
        </button>
        <hr />
      </div>
      <EditarMedicamentos></EditarMedicamentos>
    </div>
  );
};

export default Medicamentos;
