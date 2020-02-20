import React, {useState} from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav
  // NavItem,
  // NavLink
} from 'reactstrap'

export default function NavBar () {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="mb-4">
      <Navbar className="bg-primary" light expand="md">
        <div className="container">
          <NavbarBrand>Ost</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar color="white">
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    </div>
  );
}
