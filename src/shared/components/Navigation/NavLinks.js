import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import Button from '../FormElements/Button';

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext)

  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>ALL USERS</NavLink>
    </li>
    {auth.isLogged && <li>
      <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
    </li>}
    {auth.isLogged && <li>
      <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>}
    {!auth.isLogged ? <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li> :
      <li>
        <Button onClick={auth.logout}>LOGOUT</Button>
      </li>}
  </ul>
};

export default NavLinks;