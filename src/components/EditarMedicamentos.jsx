// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./EditarMedicamentos.css";

const EditarMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentoId, setMedicamentoId] = useState("");
  const [medicamento, setMedicamento] = useState({
    nombre: "",
    descripcion: "",
    dosis: "",
    sirvePara: "",
    horasDeDosis: [],
  });
  const [horaDosis1, setHoraDosis1] = useState("");
  const [horaDosis2, setHoraDosis2] = useState("");
  const [horaDosis3, setHoraDosis3] = useState("");
  const [horaDosis4, setHoraDosis4] = useState("");

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      const medicamentosFromDB = await db.medications.toArray();
      setMedicamentos(medicamentosFromDB);
    } catch (error) {
      toast.error("Error al cargar los medicamentos.")
      console.error("Error al cargar los medicamentos:", error);
    }
  };

  const cargarDatosMedicamento = async () => {
    try {
      const medicamentoEncontrado = await db.medications.get(
        parseInt(medicamentoId, 10)
      );

      if (medicamentoEncontrado) {
        setMedicamento({
          nombre: medicamentoEncontrado.nombre,
          descripcion: medicamentoEncontrado.descripcion,
          dosis: medicamentoEncontrado.dosis,
          sirvePara: medicamentoEncontrado.sirvePara,
          horasDeDosis: medicamentoEncontrado.horasDeDosis || [],
        });

        // Establecer las horas de dosis en los estados separados
        setHoraDosis1(medicamentoEncontrado.horasDeDosis[0] || "");
        setHoraDosis2(medicamentoEncontrado.horasDeDosis[1] || "");
        setHoraDosis3(medicamentoEncontrado.horasDeDosis[2] || "");
        setHoraDosis4(medicamentoEncontrado.horasDeDosis[3] || "");
      }
    } catch (error) {
      toast.error("Error al cargar datos del medicamento.")
      console.error("Error al cargar datos del medicamento:", error);
    }
  };

  const actualizarMedicamento = async () => {
    try {
      await db.medications.update(parseInt(medicamentoId, 10), {
        nombre: medicamento.nombre,
        descripcion: medicamento.descripcion,
        dosis: medicamento.dosis,
        sirvePara: medicamento.sirvePara,
        horasDeDosis: [horaDosis1, horaDosis2, horaDosis3, horaDosis4].filter(
          Boolean
        ),
      });
      toast.success("Datos actualizados correctamente.")
      
      // Limpiar el formulario después de la actualización
      setMedicamentoId("");
      setMedicamento({
        nombre: "",
        descripcion: "",
        dosis: "",
        sirvePara: "",
        horasDeDosis: [],
      });
      setHoraDosis1("");
      setHoraDosis2("");
      setHoraDosis3("");
      setHoraDosis4("");
    } catch (error) {
      toast.error("Error al actualizar el medicamento.")
      console.error("Error al actualizar el medicamento:", error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setMedicamentoId(selectedId);
  };

  const handleEditarClick = () => {
    if (medicamentoId) {
      cargarDatosMedicamento();
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

  return (
    <div>
      <hr />
      <div className="contenedor-inputs">
      <h2>Editar Medicamento</h2>
        <select value={medicamentoId} onChange={handleSelectChange}>
          <option value="">Selecciona un medicamento</option>
          {medicamentos.map((medicamento) => (
            <option key={medicamento.id} value={medicamento.id}>
              {medicamento.nombre}
            </option>
          ))}
        </select>
        <br />
        <button onClick={handleEditarClick} className="boton-editar" >Editar medicamento</button>
        <br />
        <input
          type="text"
          placeholder="Nombre del Medicamento"
          value={medicamento.nombre}
          onChange={(e) =>
            setMedicamento({ ...medicamento, nombre: e.target.value })
          }
        />
        <br />
        <textarea
          rows={4}
          placeholder="Descripción"
          value={medicamento.descripcion}
          onChange={(e) =>
            setMedicamento({
              ...medicamento,
              descripcion: e.target.value,
            })
          }
        />
        <br />
        <textarea
          rows={4}
          placeholder="Dosis"
          value={medicamento.dosis}
          onChange={(e) =>
            setMedicamento({ ...medicamento, dosis: e.target.value })
          }
        />
        <br />
        <textarea
          rows={4}
          placeholder="¿Para que sirve?"
          value={medicamento.sirvePara}
          onChange={(e) =>
            setMedicamento({ ...medicamento, sirvePara: e.target.value })
          }
        />
        <br />
        <div className="contenedor-dosis">
          <select
            value={horaDosis1}
            onChange={(e) => setHoraDosis1(e.target.value)}
          >
            <option value="">Primera dosis</option>
            {generarOpcionesDeHoras().map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          <br />
          <select
            value={horaDosis2}
            onChange={(e) => setHoraDosis2(e.target.value)}
          >
            <option value="">Segunda dosis</option>
            {generarOpcionesDeHoras().map((hora, index) => (
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
            <option value="">Tercer dosis</option>
            {generarOpcionesDeHoras().map((hora, index) => (
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
            <option value="">Cuarta dosis</option>
            {generarOpcionesDeHoras().map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>
        <br />
        <button onClick={actualizarMedicamento} className="boton-actualizar">
          Actualizar Medicamento
        </button>
      </div>
    </div>
  );
};

export default EditarMedicamentos;
