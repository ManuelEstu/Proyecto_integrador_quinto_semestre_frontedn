import React, { useState, useEffect } from 'react';
import './VisualizarTerrenos.css';

// Función que recibe un parámetro que determina qué datos mostrar (lugares, lotes o predios).
function LugaresProduccion({ tipo}) {
  // "lugares" almacena los datos que se van a mostrar
// "setLugares", función quepermite actualizar el estado
// Inicia como array vacío porque no hay datos del backend
    const [lugares, setLugares] = useState([]);
    //indica si los datos están cargando o no, para mostrar un mensaje de "Cargando..." mientras se obtienen los datos
    const [cargando, setCargando] = useState(true);

   //ejecuta una función cuando el componente se monta o cuando el valor de "tipo" cambia. En este caso, se utiliza para simular la obtención de datos del backend y actualizar el estado con esos datos.
    useEffect(() => {
        document.title = 'Panel de gestión';

        // datos de prueba temporales
        let datosPrueba = [];

        if (tipo === 'lugares') {
            datosPrueba = [
                {
                    id: 1,
                    nombre: 'Finca San José',
                    registroICA: 'ICA-123',
                    areaTotal: 120,
                    areaCultivada: 80,
                    predioCentral: 'Medellín'
                }
            ];
        }

        if (tipo === 'lotes') {
            datosPrueba = [
                {
                    id: 1,
                    numero: 'Lote A',
                    area: 10,
                    tipoCultivo: 'Café',
                    cantidadPlantas: 500,
                    fechaSiembra: '2023-01-15',
                    fechaRecoleccion: '2023-06-30'
                }
            ];
        }

        if (tipo === 'predios') {
            datosPrueba = [
                {
                    id: 1,
                    nombre: 'Predio Norte',
                    registroICA: 'ICA-456',
                    area: 30,
                    departamento: 'Antioquia',
                    municipio: 'Medellín',
                    vereda: 'Vereda El Poblado',
                    lugarProduccion: 'Finca San José'
                    
                }
            ];
        }

        setLugares(datosPrueba); //borrar cuando el backend esté listo
        setCargando(false); //datos cargados

        //BACKEND - DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO
        /*
        const fetchDatos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/${tipo}`);
                const data = await response.json();
                setLugares(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setCargando(false);
            }
        };

        fetchDatos();
        */

    }, [tipo]);

  //función que recibe un objeto "item" y devuelve un array de objetos con "label" y "valor" para mostrar los datos
    const obtenerDatos = (item) => {
        //verificar que todos los nombres de .valor coincidan con el backend
        if (tipo === 'lugares') {
            return [ //Datos de previsualización para lugares. Rol de productor
                { label: 'N° Registro ICA', valor: item.registroICA },
                { label: 'Área Total', valor: item.areaTotal + ' Ha' },
                { label: 'Área Cultivada', valor: item.areaCultivada + ' Ha' },
                { label: 'Predio Central', valor: item.predioCentral }
            ];
        }
            //Datos de previsualización para lotes. Rol de productor. Colocar los datos correctos
        if (tipo === 'lotes') {
            return [
                { label: 'N° Lote', valor: item.numero},
                { label: 'Área', valor: item.area + 'Ha'},
                { label: 'Cultivo', valor: item.tipoCultivo},
                { label: 'Cantidad de plantas', valor: item.cantidadPlantas},
                { label: 'Fecha de siembra', valor: item.fechaSiembra},
                { label: 'Fecha de recolección', valor: item.fechaRecoleccion}
            ];
        }
            //Datos de previsualización para predios. Rol de propietario. Colocar los datos correctos
        if (tipo === 'predios') {
            return [
                { label: 'N° Registro ICA', valor: item.registroICA },
                { label: 'Área', valor: item.area + ' Ha' },
                { label: 'Departamento', valor: item.departamento},
                { label: 'Municipio', valor: item.municipio },
                { label: 'Vereda/dirección', valor: item.vereda},
                { label: 'Lugar de producción', valor: item.lugarProduccion}

            ];
        }

        return [];
    };

   //función temporal para agregar un lugar, predio o lote
   //Borrarlo e importar el archvio frontend cuando esté listo
    const handleAgregar = () => {
        alert(`Agregar nuevo ${tipo}`);
    };

    // Renderizado del componente
    return (
        <section className="production-panel">

            <h2 className="panel-title">{/* Título dinámico según el tipo de datos que se muestra */}
                {/* El título cambia según el valor de tipo, si "tipo" es "lugares", se muestra "Lugares de Producción" y así sucesivamente */}
                {tipo === 'lugares' && 'Lugares de Producción'}
                {tipo === 'lotes' && 'Lotes'}
                {tipo === 'predios' && 'Predios'}
            </h2>

            {/*Mostrar mensaje de carga cuando está cargando la información */}
            {/*Después de cargar, si no hay registros mostrar el mensaje "No hay registros." */}
            {/* */}
            {cargando ? (
                <p>Cargando...</p>
            ) : lugares.length === 0 ? ( 
                <p>No hay registros.</p>
            ) : (

                lugares.map((item) => (
                    // key para identificar cada elemento de la lista y optimizar el render.
                    <div key={item.id} className="horizontal-card">

                        {/* Visualización a la izquierda */}
                        <div className="card-left-section">
                            <h3>
                                {/* Si es lote se usa el número del mismo */}
                                {/* Si no, se usa el nombre */}
                                {tipo === 'lotes'? `Lote ${item.numero}`: item.nombre}
                            </h3>

                            <div className="card-actions"> {/*Botones para implementar edición y eliminación */}
                                <button className="icon-btn edit-btn">Editar</button>
                                <button className="icon-btn delete-btn">Eliminar</button>
                            </div>
                        </div>

                        {/* Datos dinámicos, detalles de cada elemento */}
                        <div className="card-details-section">
                            {obtenerDatos(item).map((dato, index) => (
                                <p key={index}> {/*label -> el nombre del campo. valor -> el dato*/}
                                    <strong>{dato.label}:</strong> {dato.valor}
                                </p>
                            ))}
                        </div>

                        {/* Sección de botones a la derecha */}
                        <div className="card-button-section">

                            {tipo === 'lugares' && (
                                <> 
                                    <button className="btn-action">Predios asociados</button>
                                    <button className="btn-action">Lotes actuales</button>
                                </>
                            )}

                            {tipo === 'lotes' && ( // Definir qué botones se mostrarán para los lotes
                                <button className="btn-action">Ver detalle</button>
                            )}

                            {tipo === 'predios' && (
                                <>
                                <button className="btn-action">Asociar a lugar de producción</button>
                                <button className="btn-action">Desasociar de lugar de producción</button>
                                </>
                            )}

                        </div>

                    </div>
                ))
            )}

            {/* botón para agregar nuevos elementos (lugares, predios o lotes) */}
            <button className="fab-add" onClick={handleAgregar}>
                +
            </button>

        </section>
    );
}

export default LugaresProduccion;

