import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>React - Exemplo de CRUD</h1>
            <p>Um exemplo de CRUD usando React e Spring Boot por Vitor Abreu Bitencurt e Pedro Vitor Menegat De Araújo.</p>
            <p><Link to="recados">&gt;&gt; Gerenciar recados</Link></p>
        </div>
    );
}

export { Home };