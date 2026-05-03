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

        // ─── funcion para guardar los cambios ───────
    const guardarCambios = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // 1. Obtener el token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado');
            return;
        }

        // 2. Para enviarle los datos a el backend
        const datosParaBackend = {
            nombre: formData.nombres,
            apellido: formData.apellidos,
            direccion: formData.direccion,
            telefono: formData.telefono,
            email: formData.correo,
            password: formData.clave
        };

        try {
            // 3. Hacer la petición PATCH al backend
            const respuesta = await fetch('http://localhost:3001/api/users/editProfile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Aquí enviamos el token
                },
                body: JSON.stringify(datosParaBackend)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert('Perfil actualizado con éxito');
                
                // 4. Actualizar localStorage para que al recargar no se pierdan los cambios
                // Actualizamos solo los campos que cambiaron, conservando el resto (ej. el token)
                const usuarioActualizado = {
                    ...usuarioGuardado,
                    nombre: formData.nombres,
                    apellido: formData.apellidos,
                    direccion_residencia: formData.direccion,
                    telefono: formData.telefono,
                    correo_electronico: formData.correo,
                    clave: formData.clave
                };
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

                // 5. Apagar el modo edición
                setIsEditing(false);
            } else {
                // Mostrar el error que viene del backend (ej. Zod o tu AppError)
                alert(`Error: ${data.message || 'No se pudo actualizar'}`);
            }

        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión con el servidor');
        }
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

                    <form className="formulario-perfil" onSubmit={guardarCambios}>
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