import React from 'react';
import logo from '../images/logo.svg'

function Header() {
    return (
        <header className="header">
            <a href="#" target="_blank" rel="noopener"><img className="header__logo hover" src={logo}
                                                            alt="логотип"/></a>
        </header>
    );
}

export default Header;