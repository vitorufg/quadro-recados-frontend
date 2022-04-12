import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { recadoService } from '../_services';

function List({ match }) {
    const { path } = match;
    const [recados, setRecados] = useState(null);

    useEffect(() => {
        recadoService.getAll().then(x => setRecados(x));
    }, []);

    function deleteRecado(id) {
        setRecados(recados.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        recadoService.delete(id).then(() => {
            setRecados(recados => recados.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Recados</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Adicionar Recado</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Autor</th>
                        <th style={{ width: '50%' }}>Recado</th>
                        <th style={{ width: '20%' }}>Data</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {recados && recados.reverse().map(recado =>
                        <tr key={recado.id}>
                            <td>{recado.autor}</td>
                            <td>{recado.recado}</td>
                            <td>{recado.data}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${recado.id}`} className="btn btn-sm btn-primary mr-1">Editar</Link>
                                <button onClick={() => deleteRecado(recado.id)} className="btn btn-sm btn-danger btn-delete-recado" disabled={recado.isDeleting}>
                                    {recado.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Deletar</span>
                                    }
                                </button>
                            </td>
                        </tr> 
                    )}
                    {!recados &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {recados && !recados.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">Nenhum recado para exibir</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };