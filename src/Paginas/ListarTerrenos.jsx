function ListaTerrenos({ lugares, tipo, obtenerDatos, onEditar, onEliminar, onAsociar, onDesasociar, onVerPredios  }) {
    return (
        <>
            {lugares.map((item) => (
                <div key={item.id} className="horizontal-card">

                    <div className="card-left-section">
                        <h3>
                            {tipo === 'lotes' ? `Lote ${item.numero}` : item.nombre}
                        </h3>

                        <div className="card-actions">
                            <button
                                className="icon-btn edit-btn"
                                onClick={() => onEditar && onEditar(item)}
                            >
                                Editar
                            </button>
                            <button
                                className="icon-btn delete-btn"
                                onClick={() => onEliminar && onEliminar(item)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>

                    <div className="card-details-section">
                        {obtenerDatos(item).map((dato, index) => (
                            <p key={index}>
                                <strong>{dato.label}:</strong> {dato.valor}
                            </p>
                        ))}
                    </div>

                    <div className="card-button-section">

                        {tipo === 'lugares' && (
                            <>
                                <button
                                    className="btn-action" onClick={() => onVerPredios(item)}
                                    >Predios asociados
                                </button>
                                <button className="btn-action">Lotes actuales</button>
                            </>
                        )}

                        {tipo === 'lotes' && (
                            <button className="btn-action">Ver detalles</button>
                        )}

                        {tipo === 'predios' && (
                            <>
                                <button
                                    className="btn-action"
                                    onClick={() => onAsociar && onAsociar(item)}
                                >
                                    Asociar a lugar de producción
                                </button>
                                
                                <button
                                    className="btn-action"
                                    onClick={() => {
                                    if (!item.lugar_produccion) {
                                        alert("Este predio no está asociado a ningún lugar de producción.");
                                        return;
                                    } onDesasociar && onDesasociar(item);
                                    }}
                                    >Desasociar de lugar de producción
                                </button>
                            </>
                        )}

                    </div>

                </div>
            ))}
        </>
    );
}

export default ListaTerrenos;