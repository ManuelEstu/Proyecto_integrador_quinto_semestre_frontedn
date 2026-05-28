import { useEffect, useState } from "react";
// Importamos la URL base de tus servicios de inspección
import BASE_URL_INSPECTIONS from '@/services/api-inspections';

function PestanaGeneral({ idInspeccionSeleccionada, onVolver }) {
    
//Parte de la lógica
    const [datosLugar, setDatosLugar] = useState(null); // Almacena el objeto completo del lugar, cultivos y lotes
    const [cargando, setCargando] = useState(true);     // Estado de carga visual
    const [error, setError] = useState(null);           // Captura de errores de la API

   // Servicio API para obtener los datos del lugar de producción asociado a la inspección seleccionada
    const obtenerDatosLugar = async () => {
        const token = localStorage.getItem('token');
        try {
            setCargando(true);
            setError(null);

            // Consultamos el endpoint enviando el ID de la inspección actual
            const respuesta = await fetch(`${BASE_URL_INSPECTIONS}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo obtener la información del lugar de producción.');
            }

            const data = await respuesta.json();
            
            // Guardamos la información en el estado. 
            // Se asume la estructura: { lugar: "...", cultivos: [...] }
            setDatosLugar(data.data || data); 
            setCargando(false);

        } catch (err) {
            console.error("Error cargando lugar:", err);
            setError(err.message);
            setCargando(false);
        }
    };

    // Dispara la consulta apenas se monte el componente en pantalla
    useEffect(() => {
        if (idInspeccionSeleccionada) {
            obtenerDatosLugar();
        }
    }, [idInspeccionSeleccionada]);


     //PARTE DE LA VISTA 
    // CASO A: Esperando respuesta del servidor
    if (cargando) {
        return <div className="mensaje-sistema">Cargando datos del lugar de producción...</div>;
    }

    // CASO B: Ocurrió un fallo en la petición
    if (error) {
        return <div className="mensaje-sistema error">Error: {error}</div>;
    }

    // CASO C: No llegaron datos válidos
    if (!datosLugar || !datosLugar.cultivos) {
        return <div className="mensaje-sistema">No hay cultivos registrados para este lugar.</div>;
    }

    // Calcular la extensión total general del lugar (Suma de todos los lotes de todos los cultivos)
    const extensionTotalGeneral = datosLugar.cultivos.reduce((totalGlobal, cultivo) => {
        const sumaLotesCultivo = cultivo.lotes?.reduce((subTotal, lote) => subTotal + parseFloat(lote.extension || 0), 0) || 0;
        return totalGlobal + sumaLotesCultivo;
    }, 0).toFixed(2);


    return (
        <div className="contenedor-inspeccion-lugar">

            <div className="volver-container">
                <button className="fab-back" onClick={onVolver}> 
                    <ArrowLeft size={26} /> 
                </button>
            </div>

            {/* Título dinámico tomado de los datos del Backend */}
            <h2 className="titulo-lugar">{datosLugar.lugar || 'Lugar de Producción'}</h2>
            
            {/* Reutilizamos tu clase de tabla base */}
            <table className="tabla-usuarios tabla-agrupada">
                <thead>
                    <tr>
                        <th>Cultivo</th>
                        <th>Lote</th>
                        <th>Fecha de siembra</th>
                        <th>Siembra inicial [plantas]</th>
                        <th>Extensión [Ha]</th>
                        <th>Inspección</th>
                        <th></th> {/* Columna vacía para el botón "Ver" */}
                    </tr>
                </thead>

                <tbody>
                    {datosLugar.cultivos.map((cultivo, indexCultivo) => {
                        
                        // LÓGICA DE FILAS COMBINADAS:
                        // El rowSpan debe cubrir la cantidad de lotes del cultivo + 1 fila para su subtotal
                        const cantidadLotes = cultivo.lotes?.length || 0;
                        const totalFilasAgrupadas = cantidadLotes + 1;

                        // CÁLCULO DE SUB-TOTALES POR CULTIVO (Hecho dinámicamente en el Frontend)
                        const subtotalPlantas = cultivo.lotes?.reduce((sum, lote) => sum + parseInt(lote.siembra_inicial || 0), 0) || 0;
                        const subtotalExtension = cultivo.lotes?.reduce((sum, lote) => sum + parseFloat(lote.extension || 0), 0).toFixed(2) || 0;

                        return (
                            <tr key={indexCultivo}> {/* Usamos un fragmento simulado mediante herencia para renderizar múltiples filas por iteración */}
                                <td colSpan="7" style={{ padding: 0, border: 'none' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
                                        <tbody>
                                            {/* Iteramos los lotes individuales de este cultivo específico */}
                                            {cultivo.lotes?.map((lote, indexLote) => (
                                                <tr key={lote.id}>
                                                    
                                                    {/* 💡 AQUÍ ESTÁ EL TRUCO VISUAL: La celda del cultivo (Foto y Nombres) 
                                                        SÓLO se dibuja en la PRIMERA fila del lote (indexLote === 0) */}
                                                    {indexLote === 0 && (
                                                        <td rowSpan={totalFilasAgrupadas} className="celda-cultivo-principal">
                                                            {lote.imagen_url && (
                                                                <img src={lote.imagen_url} alt={cultivo.nombre} className="img-cultivo" />
                                                            )}
                                                            <div className="nombre-cultivo">{cultivo.nombre}</div>
                                                            <div className="cientifico-cultivo">{cultivo.nombre_cientifico}</div>
                                                        </td>
                                                    )}

                                                    {/* Columnas normales con la información del lote */}
                                                    <td>{lote.id}</td>
                                                    <td>{lote.fecha_siembra || '--'}</td>
                                                    <td>{parseInt(lote.siembra_inicial).toLocaleString() || '0'}</td>
                                                    <td>{lote.extension || '0'}</td>
                                                    
                                                    {/* Estado con su clase dinámica para pintar el texto (Terminada verde, Pendiente rojo) */}
                                                    <td className={`estado-texto ${lote.estado?.toLowerCase()}`}>
                                                        {lote.estado}
                                                    </td>
                                                    
                                                    <td>
                                                        <button 
                                                            className="btn-ver-lote"
                                                            onClick={() => console.log(`Redireccionando al formulario del lote: ${lote.id}`)}
                                                        >
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* FILA DE SUBTOTAL: Aparece inmediatamente abajo del último lote de este cultivo */}
                                            <tr className="fila-subtotal">
                                                <td className="texto-subtotal">Subtotal</td>
                                                <td></td> {/* Vacío: Fecha de siembra no tiene subtotal */}
                                                <td>{subtotalPlantas.toLocaleString()}</td>
                                                <td>{subtotalExtension}</td>
                                                <td></td> {/* Vacío: Estado */}
                                                <td></td> {/* Vacío: Botón */}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        );
                    })}

                    {/* FILA DE TOTAL GENERAL: Se ubica al final de toda la tabla */}
                    <tr className="fila-total-general">
                        <td colSpan="4" className="texto-total">Total</td>
                        <td className="valor-total">{extensionTotalGeneral}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PestanaGeneral;