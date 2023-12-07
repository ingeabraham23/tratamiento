import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import db from "../db";
import "./Receta.css";
import EditarRecetas from "./EditarReceta";
import RenderizarRecetas from "./RenderizarRecetas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

const Receta = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [selectedMedicamentoId, setSelectedMedicamentoId] = useState("");
  const [selectedMedicamentos, setSelectedMedicamentos] = useState([]);
  const [doctorNombre, setDoctorNombre] = useState("");
  const [pacienteNombre, setPacienteNombre] = useState("");
  const [consultorioDireccion, setConsultorioDireccion] = useState("");
  const [fecha, setFecha] = useState(null);

  useEffect(() => {
    setFecha(new Date());
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    try {
      const medicamentosFromDB = await db.medications.toArray();
      setMedicamentos(medicamentosFromDB);
    } catch (error) {
      toast.error("Error al obtener los medicamentos.");
      console.error("Error al obtener los medicamentos:", error);
    }
  };

  const handleMedicamentoSelect = (event) => {
    setSelectedMedicamentoId(event.target.value);
  };

  const agregarMedicamento = () => {
    // Verifica que se haya seleccionado un medicamento
    if (selectedMedicamentoId) {
      const medicamento = medicamentos.find(
        (m) => m.id === parseInt(selectedMedicamentoId, 10)
      );

      // Verifica que se haya encontrado el medicamento
      if (medicamento) {
        // Agrega el medicamento a la lista de medicamentos seleccionados
        setSelectedMedicamentos([
          ...selectedMedicamentos,
          selectedMedicamentoId,
        ]);
        toast.success("Medicamento agregado correctamente.");
        // Limpia los estados después de agregar
        setSelectedMedicamentoId("");
      } else {
        toast.error(
          "Error: No se encontró el medicamento con el ID:",
          selectedMedicamentoId
        );
        console.error(
          "Error: No se encontró el medicamento con el ID:",
          selectedMedicamentoId
        );
      }
    }
  };

  const convertirFormatoHora = (hora24) => {
    const hora24Numerica = parseInt(hora24.substr(0, 2), 10);
    const minutos = hora24.substr(3);

    let periodo = "AM";

    if (hora24Numerica >= 12) {
      periodo = "PM";
    }

    let hora12 = hora24Numerica > 12 ? hora24Numerica - 12 : hora24Numerica;

    if (hora12 === 0) {
      hora12 = 12;
    }

    if (hora24Numerica < 12) {
      periodo = "de la mañana.";
    } else if (hora24Numerica < 19) {
      periodo = "de la tarde.";
    } else {
      periodo = "de la noche.";
    }

    return `${hora12}:${minutos} ${periodo}`;
  };

  const agregarReceta = async () => {
    setFecha(new Date());
    try {
      // Validaciones (puedes agregar más según tus necesidades)
      if (!doctorNombre || !pacienteNombre || !consultorioDireccion) {
        toast.error("Todos los campos son obligatorios.");
        return null;
      }

      // Obtén los detalles completos de los medicamentos seleccionados
      const medicamentosSeleccionados = selectedMedicamentos.map(
        (medicamentoId) => {
          const medicamento = medicamentos.find(
            (m) => m.id === parseInt(medicamentoId, 10)
          );

          if (medicamento) {
            return medicamento;
          } else {
            console.error(
              "Error: No se encontró el medicamento con el ID:",
              medicamentoId
            );
            toast.error(
              "Error: No se encontró el medicamento con el ID:",
              medicamentoId
            );
            return null;
          }
        }
      );
      // Agrega la receta a la base de datos con detalles completos de los medicamentos
      await db.recetas.add({
        fecha,
        pacienteNombre,
        doctorNombre,
        consultorioDireccion,
        medicamentos: medicamentosSeleccionados,
      });

      // Feedback al usuario (puedes personalizar el mensaje)
      toast.success("Receta agregada exitosamente.");

      // Limpia los estados después de agregar
      setFecha("");
      setPacienteNombre("");
      setDoctorNombre("");
      setConsultorioDireccion("");
      setSelectedMedicamentos([]);

      // Actualiza la lista de medicamentos
      fetchMedicamentos();
    } catch (error) {
      console.error("Error al agregar la receta:", error.message);
      toast.error(
        "Hubo un error al agregar la receta. Por favor, verifica los campos."
      );
      // Actualiza la lista de medicamentos incluso en caso de error
      fetchMedicamentos();
    }
  };

  const tablaRef = useRef(null);

  function obtenerFechaFormateada() {
    const fecha = new Date();

    // Utiliza la librería date-fns para obtener el nombre del día y del mes en español
    const options = { locale: esLocale };
    const dia = format(fecha, "EEEE", options);

    // Formatea la fecha utilizando toLocaleDateString
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${dia} ${fechaFormateada}`;
  }

  function capturarTabla(tabla, pacienteNombre) {
    const fechaFormateada = obtenerFechaFormateada();

    html2canvas(tabla).then(function (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `receta ${pacienteNombre} ${fechaFormateada}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  return (
    <div>
      <h2>Crear Receta</h2>
      <div className="contenedor-inputs">
        <DatePicker
          selected={fecha}
          onChange={(date) => setFecha(date)}
          dateFormat="EEEE d 'de' MMMM 'de' y"
          placeholderText="Seleccione una fecha"
          locale={es}
          showIcon
          withPortal
          onFocus={(e) => {
            e.target.readOnly = true;
            e.target.blur();
          }}
        />
        <input
          type="text"
          placeholder="Nombre del Doctor."
          value={doctorNombre}
          onChange={(e) => setDoctorNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre del Paciente."
          value={pacienteNombre}
          onChange={(e) => setPacienteNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección del Consultorio."
          value={consultorioDireccion}
          onChange={(e) => setConsultorioDireccion(e.target.value)}
        />
        <select
          value={selectedMedicamentoId}
          onChange={handleMedicamentoSelect}
        >
          <option value="">Seleccione un medicamento</option>
          {medicamentos.map((medicamento) => (
            <option key={medicamento.id} value={medicamento.id}>
              {medicamento.nombre}
            </option>
          ))}
        </select>
        <button onClick={agregarMedicamento} className="boton-agregar">
          Agregar Medicamento
        </button>
      </div>
      {/* Medicamentos seleccionados */}
      {selectedMedicamentos.length > 0 && (
        <div>
          <table className="tabla-receta" ref={tablaRef}>
            {fecha && (
              <thead>
                <tr className="fila-encabezado">
                  <th colSpan={3}>
                    {" "}
                    {format(fecha, "EEEE dd 'de' MMMM 'de' yyyy", {
                      locale: esLocale,
                    })}
                  </th>
                </tr>
                <tr className="fila-encabezado">
                  <th colSpan={3}> {doctorNombre}</th>
                </tr>
                <tr className="fila-encabezado">
                  <th colSpan={3}> {pacienteNombre}</th>
                </tr>
                <tr className="separador">
                  <td colSpan={3}></td>
                </tr>
              </thead>
            )}
            <tbody>
              {selectedMedicamentos.map((medicamentoId) => {
                const medicamento = medicamentos.find(
                  (m) => m.id === parseInt(medicamentoId, 10)
                );

                if (medicamento) {
                  return (
                    <React.Fragment key={medicamento.id}>
                      <tr>
                        <td className="column-medicamento" colSpan={2}>
                          {medicamento.nombre || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="column-dosis" colSpan={2}>
                          {medicamento.dosis || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="column-sirve" colSpan={2}> 
                          {medicamento.sirvePara || "N/A"}
                        </td>
                      </tr>

                      {medicamento.horasDeDosis &&
                      medicamento.horasDeDosis.length > 0 ? (
                        medicamento.horasDeDosis.map((hora, index) => (
                          <tr key={index}>
                            <td className="numero-dosis">{index == 0 && "Primera dosis." || index == 1 && "Segunda dosis." || index == 2 && "Tercera dosis." || index == 3 && "Cuarta dosis."}</td>
                            <td className="column-horarios">
                              {convertirFormatoHora(hora) || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>N/A</td>
                        </tr>
                      )}
                      <tr className="separador">
                        <td colSpan={3}></td>
                      </tr>
                    </React.Fragment>
                  );
                } else {
                  console.error(
                    "Error: No se encontró el medicamento con el ID:",
                    medicamentoId
                  );
                  return null;
                }
              })}
            </tbody>
            <tfoot>
              <tr className="fila-pie">
                <td colSpan={2}>{consultorioDireccion}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <div className="contenedor-botones">
        <button onClick={agregarReceta} className="boton-guardar" >Guardar Receta</button>
        <button onClick={() => capturarTabla(tablaRef.current, pacienteNombre)} className="boton-capturar">
          Capturar
        </button>
      </div>
      <hr></hr>
      <EditarRecetas></EditarRecetas>
      <RenderizarRecetas></RenderizarRecetas>
    </div>
  );
};

export default Receta;
