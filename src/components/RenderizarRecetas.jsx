import React, { useRef, useState, useEffect } from "react";
import db from "../db";
import html2canvas from "html2canvas";

import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import "./RenderizarRecetas.css";
const RenderizarRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

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

  const tablaRef = useRef(null);

  const capturarTabla = (tabla, pacienteNombre) => {
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

  return (
    <div>
      <div className="contenedor">
        <h2>Renderizar Recetas</h2>
        <select
          value={recetaSeleccionada ? recetaSeleccionada.id : ""}
          onChange={(e) =>
            setRecetaSeleccionada(
              recetas.find((r) => r.id === parseInt(e.target.value, 10))
            )
          }
        >
          <option value="">Selecciona una receta</option>
          {recetas.map((receta) => (
            <option key={receta.id} value={receta.id}>
              {receta.pacienteNombre}
            </option>
          ))}
        </select>
        <br />
        {recetaSeleccionada && (
          <div className="contenedor">
            <table className="tabla-receta-renderizada" ref={tablaRef}>
              <thead>
                <tr className="fila-encabezado">
                  <th colSpan={3}>
                    {" "}
                    {format(
                      recetaSeleccionada.fecha,
                      "EEEE dd 'de' MMMM 'de' yyyy",
                      {
                        locale: esLocale,
                      }
                    )}
                  </th>
                </tr>
                <tr className="fila-encabezado">
                  <th colSpan={3}>{recetaSeleccionada.doctorNombre}</th>
                </tr>
                <tr className="fila-encabezado">
                  <th colSpan={3}>{recetaSeleccionada.pacienteNombre}</th>
                </tr>
                <tr className="separador">
                  <td colSpan={3}></td>
                </tr>
              </thead>
              <tbody>
                {recetaSeleccionada.medicamentos.map((medicamento) => (
                  <React.Fragment key={medicamento.id}>
                    <tr>
                      <td className="column-medicamento" colSpan={2}>
                        {medicamento.descripcion || "N/A"}
                      </td>
                    </tr>
                    <tr className="fila-dosis">
                      <td className="column-dosis" colSpan={2}>
                        <strong>{medicamento.dosis || "N/A"}</strong>
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
                          <td className="column-horarios" colSpan={2}>
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
                ))}
              </tbody>
              <tfoot>
                <tr className="fila-pie">
                  <td colSpan={2}>{recetaSeleccionada.consultorioDireccion}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        {/* Botón para capturar la tabla */}
        <button
          onClick={() =>
            capturarTabla(tablaRef.current, recetaSeleccionada.pacienteNombre)
          }
          className="boton-capturar"
        >
          Capturar Tabla
        </button>
      </div>
    </div>
  );
};

export default RenderizarRecetas;
