import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BASE_URL from '@/services/api-entidades';
import BASE_URL_INSPECCIONES from '@/services/api-inspections';
import './SolicitudInspeccion.css'; // Reutiliza los mismos estilos base
 
function ProgramarI() {
    const navigate = useNavigate();
    const location = useLocation();
 
    // Datos recibidos desde VerSolicitudesI al navegar
    const { idMunicipio, idsolicitud } = location.state || {};
 
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');
    const [fechaInspeccion, setFechaInspeccion] = useState('');
    const [cargandoTecnicos, setCargandoTecnicos] = useState(true);
    const [enviando, setEnviando] = useState(false);
 
    // Calcular fechas mínima y máxima permitidas
    const hoy = new Date();
    const fechaMin = hoy.toISOString().split('T')[0]; // hoy
 
    const fechaMaxDate = new Date(hoy);
    fechaMaxDate.setMonth(fechaMaxDate.getMonth() + 1);
    const fechaMax = fechaMaxDate.toISOString().split('T')[0]; // un mes después
 
    useEffect(() => {
        document.title = "Programar inspección";
 
        // Si no llegaron los datos necesarios, volver atrás
        if (!idMunicipio || !idsolicitud) {
            alert("Faltan datos para programar la inspección.");
            navigate(-1);
            return;
        }
 
        // Cargar técnicos disponibles según el municipio
        const fetchTecnicos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BASE_URL}/users/tecnico/${idMunicipio}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                setTecnicos(data.data || []);
            } catch (error) {
                console.error("Error cargando técnicos:", error);
            } finally {
                setCargandoTecnicos(false);
            }
        };
 
        fetchTecnicos();
    }, [idMunicipio, idsolicitud, navigate]);
 
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
 
        const formData = {
            idsolicitud,
            idtecnico: tecnicoSeleccionado,
            fecha_inspeccion: fechaInspeccion,
            estado: 'Aprobado'
        };
 
        try {
            const token = localStorage.getItem('token');
 
            // Enviar la programación al backend (ajusta el endpoint según tu API)
            const response = await fetch(`${BASE_URL_INSPECCIONES}/inspecciones/programar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(formData)
            });
 
            const data = await response.json();
 
            if (response.ok) {
                alert(data.message || "¡Inspección programada exitosamente!");
                navigate(-1); // Regresa a la lista de solicitudes
            } else {
                alert(data.message || "Error al programar la inspección.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor. Inténtalo más tarde.");
        } finally {
            setEnviando(false);
        }
    };
 
    return (
        <div>
            <div className="card">
                <main>
                    <h1 className="card-title">Programar Inspección</h1>
 
                    <form onSubmit={handleSubmit}>
 
                        {/* Técnico */}
                        <div className="form-group">
                            <label htmlFor="tecnico" className="label-base">
                                (*) Técnico asignado:
                            </label>
                            <select
                                id="tecnico"
                                className="input-base"
                                value={tecnicoSeleccionado}
                                onChange={(e) => setTecnicoSeleccionado(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Seleccione un técnico --</option>
                                {cargandoTecnicos ? (
                                    <option disabled>Cargando técnicos...</option>
                                ) : tecnicos.length === 0 ? (
                                    <option disabled>No hay técnicos disponibles</option>
                                ) : (
                                    tecnicos.map((tecnico) => (
                                        <option key={tecnico.id} value={tecnico.id}>
                                            {tecnico.nombre} {tecnico.apellido}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
 
                        {/* Fecha */}
                        <div className="form-group">
                            <label htmlFor="fecha" className="label-base">
                                (*) Fecha de inspección:
                            </label>
                            <input
                                id="fecha"
                                type="date"
                                className="input-base"
                                value={fechaInspeccion}
                                min={fechaMin}
                                max={fechaMax}
                                onChange={(e) => setFechaInspeccion(e.target.value)}
                                required
                            />
                        </div>
 
                        {/* Botones */}
                        <div className="contenedor-botones">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate(-1)}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={enviando}
                            >
                                {enviando ? 'Programando...' : 'Programar'}
                            </button>
                        </div>
 
                    </form>
                </main>
            </div>
        </div>
    );
}
 
export default ProgramarI;