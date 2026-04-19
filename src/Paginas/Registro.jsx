import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/imagenes/logo.png';
import './Registro.css';

const BASE_URL = 'http://localhost:3001/api';

/**
 * Componente de Registro de usuarios para el sistema ICA
 */
function Registro() {
    useEffect(() => {
        document.title = "Registro - ICA";
    }, []);

    // ==================== ESTADOS ====================
    const [tipoUsuario, setTipoUsuario] = useState('Productor');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

    // Estados para campos del formulario
    const [nit, setNit] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [tarjetaProfesional, setTarjetaProfesional] = useState('');

    // Estados para ubicaciones (desde backend)
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');

    const esTecnico = tipoUsuario === 'Tecnico';

    // ==================== FUNCIONES ====================

    const alternarContrasena = () => setMostrarContrasena(!mostrarContrasena);
    const alternarConfirmarContrasena = () => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena);

    // Cargar Departamentos y Municipios desde el backend
    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const [depRes, munRes] = await Promise.all([
                    fetch(`${BASE_URL}/locations/departamentos`),
                    fetch(`${BASE_URL}/locations/municipios`)
                ]);

                if (depRes.ok) {
                    const deps = await depRes.json();
                    setDepartamentos(deps.data);
                }

                if (munRes.ok) {
                    const muns = await munRes.json();
                    setMunicipios(muns.data);
                }
            } catch (error) {
                console.error("Error al cargar departamentos y municipios:", error);
                alert("No se pudieron cargar los departamentos. Verifica tu conexión.");
            }
        };

        cargarUbicaciones();
    }, []);

    // Filtra municipios según el departamento seleccionado
    const municipiosFiltrados = municipios.filter(
        mun => mun.id_departamento === Number(departamentoSeleccionado)
    );

    const handleDepartamentoChange = (e) => {
        setDepartamentoSeleccionado(e.target.value);
        setMunicipioSeleccionado('');
    };

    const handleTipoUsuarioChange = (e) => {
        const nuevoTipo = e.target.value;
        setTipoUsuario(nuevoTipo);

        if (nuevoTipo !== 'Tecnico') {
            setDepartamentoSeleccionado('');
            setMunicipioSeleccionado('');
            setTarjetaProfesional('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ── Logs de diagnóstico ──
        console.log("tipoUsuario al submit:", tipoUsuario);
        console.log("tarjetaProfesional al submit:", tarjetaProfesional);

        if (password !== confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (tipoUsuario === 'Tecnico' && !tarjetaProfesional) {
            alert("La tarjeta profesional es obligatoria para técnicos");
            return;
        }

        if (tipoUsuario === 'Tecnico' && !departamentoSeleccionado) {
            alert("Debes seleccionar un departamento");
            return;
        }

        if (tipoUsuario === 'Tecnico' && !municipioSeleccionado) {
            alert("Debes seleccionar un municipio");
            return;
        }

        const formData = {
            cc: nit,
            nombre,
            apellido,
            direccion_residencia: direccion,
            telefono,
            correo_electronico: email,
            clave: password,
            rol: tipoUsuario,
            // ← usamos tipoUsuario directamente, no esTecnico
            tarjeta_profesional: tipoUsuario === 'Tecnico' ? tarjetaProfesional : null,
            id_municipio: tipoUsuario === 'Tecnico' ? Number(municipioSeleccionado) : null,
        };

        console.log("formData a enviar:", formData); // ── verifica el objeto completo

        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            if (response.ok) {
                alert("¡Registro exitoso!, favor espere a que se le acepte la solicitud de ingreso");
            } else {
                alert(data.message || "Error al registrar usuario");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor. Inténtalo más tarde.");
        }
    };

    // ==================== ICONOS SVG ====================
    const IconoOjoAbierto = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const IconoOjoCerrado = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    // ==================== RENDER ====================
    return (
        <div className="contenedor-pagina-registro">
            <header className="cabecera-logo">
                <img src={logo} alt="Logo ICA" className="logo-principal" />
            </header>

            <div className="contenedor-formulario">
                <main>
                    <h1>Registro</h1>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="tipo_usuario">Tipo de usuario:</label>
                        <select
                            id="tipo_usuario"
                            value={tipoUsuario}
                            onChange={handleTipoUsuarioChange}
                        >
                            <option value="Productor">Productor</option>
                            <option value="Propietario">Propietario</option>
                            <option value="Tecnico">Técnico</option>
                        </select>

                        <label htmlFor="nit">(*) Cédula / NIT:</label>
                        <input
                            type="text"
                            id="nit"
                            value={nit}
                            onChange={e => setNit(e.target.value)}
                            required
                        />

                        <label htmlFor="nombre">(*) Nombres:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />

                        <label htmlFor="apellido">(*) Apellidos:</label>
                        <input
                            type="text"
                            id="apellido"
                            value={apellido}
                            onChange={e => setApellido(e.target.value)}
                            required
                        />

                        <label htmlFor="direccion">(*) Dirección:</label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={e => setDireccion(e.target.value)}
                            required
                        />

                        <label htmlFor="telefono">(*) Nro Telefónico:</label>
                        <input
                            type="tel"
                            id="telefono"
                            value={telefono}
                            onChange={e => setTelefono(e.target.value)}
                            required
                        />

                        <label htmlFor="email">(*) Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        {/* Campo Contraseña */}
                        <label htmlFor="password">(*) Contraseña:</label>
                        <div className="contenedor-contrasena">
                            <input
                                type={mostrarContrasena ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="boton-visibilidad"
                                onClick={alternarContrasena}
                                role="button"
                                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {mostrarContrasena ? <IconoOjoCerrado /> : <IconoOjoAbierto />}
                            </span>
                        </div>

                        {/* Campo Confirmar Contraseña */}
                        <label htmlFor="confirm_password">(*) Confirmar Contraseña:</label>
                        <div className="contenedor-contrasena">
                            <input
                                type={mostrarConfirmarContrasena ? "text" : "password"}
                                id="confirm_password"
                                value={confirmarPassword}
                                onChange={e => setConfirmarPassword(e.target.value)}
                                required
                            />
                            <span
                                className="boton-visibilidad"
                                onClick={alternarConfirmarContrasena}
                                role="button"
                                aria-label={mostrarConfirmarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {mostrarConfirmarContrasena ? <IconoOjoCerrado /> : <IconoOjoAbierto />}
                            </span>
                        </div>

                        {/* Campos solo para Técnicos */}
                        {esTecnico && (
                            <>
                                <label htmlFor="tarjeta_profesional">(*) Tarjeta profesional:</label>
                                <input
                                    type="text"
                                    id="tarjeta_profesional"
                                    value={tarjetaProfesional}
                                    onChange={(e) => setTarjetaProfesional(e.target.value)}
                                    required
                                />

                                <label htmlFor="departamento">(*) Departamento:</label>
                                <select
                                    id="departamento"
                                    value={departamentoSeleccionado}
                                    onChange={handleDepartamentoChange}
                                    required
                                >
                                    <option value="">Seleccione departamento</option>
                                    {departamentos.map((dep) => (
                                        <option key={dep.id_departamento} value={dep.id_departamento}>
                                            {dep.nombre}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="municipio">(*) Municipio:</label>
                                <select
                                    id="municipio"
                                    value={municipioSeleccionado}
                                    onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                                    disabled={!departamentoSeleccionado}
                                    required
                                >
                                    <option value="">Seleccione municipio</option>
                                    {municipiosFiltrados.map((mun) => (
                                        <option key={mun.id_municipio} value={mun.id_municipio}>
                                            {mun.nombre}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <button type="submit" className="boton-registrar">Crear cuenta</button>
                    </form>

                    <p className="texto-ya-tiene-cuenta">
                        ¿Ya tienes una cuenta? <Link className="regreso-login" to="/login">Iniciar Sesión</Link>
                    </p>
                </main>
            </div>
        </div>
    );
}

export default Registro;