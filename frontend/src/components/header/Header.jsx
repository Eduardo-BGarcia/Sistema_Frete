import React from 'react';
import './Header.css';

const Header = ({ titulo }) => {
    return (
        <header className="header-container">
            <h1 className="header-title">
                {titulo}
            </h1>
        </header>
    );
};

export default Header;