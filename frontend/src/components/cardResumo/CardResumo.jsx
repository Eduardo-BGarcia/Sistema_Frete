import React from 'react';
import { Card } from 'primereact/card';

const CardResumo = ({ titulo, valor }) => {
    return (
        <Card title={titulo} style={{ width: '300px', margin: '10px', height: '180px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {valor}
            </p>
        </Card>
    );
};

export default CardResumo;