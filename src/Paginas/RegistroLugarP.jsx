import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos para poder cancelar/navegar
import './RegistroLugarP.css';

function RegistroLugarP() {
    // 1. Declaramos los estados que faltaban
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Registro lugar de producción";
    }, []);

    // 2. Función para cancelar
    const handleCancelar = () => {
        setNombre('');
        navigate(-1); // Esto vuelve a la página anterior
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 3. Usamos la variable 'nombre' del estado directamente
        const formData = {
            nombre: nombre.trim()
        };

        try {
            const response = await fetch('http://localhost:5000/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Registro exitoso!");
                setNombre(''); // Limpiamos después de éxito
            } else {
                alert(data.message || "Error al registrar lugar de producción");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor. Inténtalo más tarde.");
        }
    };

    return (
        <div className="contenedor-pagina-registro">
            <div className="contenedor-formulario">
                <main>
                    <h1>Registro de Lugar</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nombre">(*) Nombre del Lugar:</label>
                        <input 
                            type="text" 
                            id="nombre" 
                            value={nombre} // Ahora sí existe
                            onChange={(e) => setNombre(e.target.value)} // Ahora sí existe
                            required 
                        />

                        <div className="contenedor-botones">
                            <button type="submit" className="boton-registrar">
                                Registrar
                            </button>
                            <button 
                                type="button" 
                                className="boton-cancelar" 
                                onClick={handleCancelar} // Ahora sí existe
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default RegistroLugarP;