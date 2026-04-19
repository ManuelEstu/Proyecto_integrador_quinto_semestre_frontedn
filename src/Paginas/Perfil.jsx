import React, { useState, useEffect } from 'react';
import fotoDefecto from '../assets/Imagenes/Foto defecto.webp';
import './Perfiles.css';

function Perfil() {

    useEffect(() => {
        document.title = "Perfil usuario";
    }, []);

    const [isEditing, setIsEditing]                = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    // ─── Leer datos del usuario desde localStorage ──────────────────────────
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');

    // ─── Estado del formulario inicializado con los datos reales ────────────
    const [formData, setFormData] = useState({
        cc:        usuarioGuardado.cc                   || '',
        nombres:   usuarioGuardado.nombre               || '',
        apellidos: usuarioGuardado.apellido             || '',
        direccion: usuarioGuardado.direccion_residencia  || '',
        telefono:  usuarioGuardado.telefono             || '',
        correo:    usuarioGuardado.correo_electronico    || '',
        clave:     usuarioGuardado.clave                || '',
    });

    const alternarContrasena = () => setMostrarContrasena(prev => !prev);

    // ─── Actualizar campo al escribir ───────────────────────────────────────
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ─── Campos del formulario ───────────────────────────────────────────────
    const campos = [
        { label: 'CC:',        name: 'cc',        val: formData.cc,        disabled: true },
        { label: 'Nombres:',   name: 'nombres',   val: formData.nombres },
        { label: 'Apellidos:', name: 'apellidos', val: formData.apellidos },
        { label: 'Dirección:', name: 'direccion', val: formData.direccion },
        { label: 'Teléfono:',  name: 'telefono',  val: formData.telefono },
        { label: 'Correo:',    name: 'correo',    val: formData.correo },
    ];

    return (
        <div className="contenedor-pantalla-perfil">
            <main className="contenido-principal">
                <section className="tarjeta-perfil">
                    <h2 className="titulo-perfil">Información Personal</h2>

                    <div className="contenedor-avatar">
                        <img src={fotoDefecto} alt="Perfil" className="imagen-perfil" />
                    </div>

                    <form className="formulario-perfil">
                        {campos.map((item) => (
                            <div className="grupo-campo" key={item.name}>
                                <label>{item.label}</label>
                                <input
                                    type="text"
                                    name={item.name}
                                    value={item.val}
                                    onChange={manejarCambio}
                                    disabled={item.disabled || !isEditing}
                                />
                            </div>
                        ))}

                        {/* ── Campo Contraseña ─────────────────────────────── */}
                        <div className="grupo-campo">
                            <label>Contraseña:</label>
                            <div className="contenedor-contrasena-perfil">
                                <input
                                    type={mostrarContrasena ? 'text' : 'password'}
                                    name="clave"
                                    value={formData.clave}
                                    onChange={manejarCambio}
                                    disabled={!isEditing}
                                />
                                <span
                                    className="boton-visibilidad-perfil"
                                    onClick={alternarContrasena}
                                    role="button"
                                    aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {mostrarContrasena ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="contenedor-botones">
                            <button
                                type="button"
                                className="boton-editar"
                                onClick={() => setIsEditing(prev => !prev)}
                            >
                                {isEditing ? 'Cancelar' : 'Editar perfil'}
                            </button>

                            <button
                                type="submit"
                                className={`boton-guardar ${isEditing ? 'activo' : ''}`}
                                disabled={!isEditing}
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Perfil;