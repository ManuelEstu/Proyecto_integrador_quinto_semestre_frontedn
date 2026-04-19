import React from 'react';
import logo from '../assets/Imagenes/logo.png';
import './Menu.css';

function Menu({ 
    isSidebarOpen, 
    alternarSidebar, 
    seccionActiva, 
    setSeccionActiva, 
    tipoUsuario 
}) {
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('estado');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const menuOpciones = {
        productor: [
            { id: "perfil", label: "Perfil" },
            { id: "lugares", label: "Lugares de producción" },
            { id: "solicitar", label: "Solicitar inspección" },
            { id: "pendientes", label: "Inspecciones pendientes" },
            { id: "informes", label: "Informes de producción" },
            { id: "resultados", label: "Resultados Inspecciones" },
        ],
        tecnico: [
            { id: "perfil", label: "Perfil" },
            { id: "pendientes", label: "Inspecciones pendientes" },
            { id: "plagas", label: "Plagas" },
            { id: "plantas", label: "Plantas" },
            { id: "predios", label: "Predios" },
            { id: "lugares", label: "Lugares de producción" },
        ],
        funcionario: [
            { id: "perfil", label: "Perfil" },
            { id: "solicitudesUsuarios", label: "Solicitudes usuarios" },
            { id: "solicitudesInspeccion", label: "Solicitudes inspección" },
            { id: "lugares", label: "Lugares de producción" },
            { id: "predios", label: "Predios" },
            { id: "usuarios", label: "Usuarios" },
            { id: "informes", label: "Informes inspecciones" },
        ],
        propietario: [
            { id: "perfil", label: "Perfil" },
            { id: "predios", label: "Predios" },
        ]
    };

    const opciones = menuOpciones[tipoUsuario] || menuOpciones.productor;

    return (
        <aside className={`barra-lateral ${isSidebarOpen ? 'abierta' : 'cerrada'}`}>
            <div 
                className="boton-toggle-sidebar"
                onClick={alternarSidebar}
            >
                {isSidebarOpen ? '◀' : '▶'}
            </div>

            <div className="contenedor-logo">
                <img src={logo} alt="Logo ICA" />
            </div>

            <nav className="navegacion-perfil">
                {opciones.map((opcion) => (
                    <button
                        key={opcion.id}
                        className={`enlace-perfil ${seccionActiva === opcion.id ? 'activo' : ''}`}
                        onClick={() => setSeccionActiva(opcion.id)}
                    >
                        {opcion.label}
                    </button>
                ))}
            </nav>

            <button onClick={cerrarSesion} className="boton-cerrar-sesion">
                Cerrar Sesión
            </button>
        </aside>
    );
}

export default Menu;