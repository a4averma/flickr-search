import React from 'react';
import AppBar from './AppBar';
import Search from './Search';

function Header(props) {
    return(
    <AppBar>
        <Search handlePhotoChange={props.handlePhotoChange}></Search>
    </AppBar>
    )
}

export default Header;