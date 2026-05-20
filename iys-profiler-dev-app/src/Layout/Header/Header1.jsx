'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  UncontrolledDropdown
} from 'reactstrap';
// import { NavLink } from 'react-bootstrap';
import navLinks from '../../api/NavLinks';

const Header1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isCartview, setIsCartview] = useState(false);
  const wrapperRef = useRef(null);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const [openMenus, setOpenMenus] = useState([]);

  const toggleMenu = (index) => {
    if (openMenus.includes(index)) {
      setOpenMenus(openMenus.filter((item) => item !== index));
    } else {
      setOpenMenus([...openMenus, index]);
    }
  };
  // const closeAllMenus = () => {
  //   setOpenMenus([]);
  // };
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsCartview(false);
    }
  };
  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollTop > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: smooth scrolling animation
    });
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
    setOpenMenus([]);
    goToTop();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      style={{ userSelect: 'none' }}
      id="site-header"
      className="header border-bottom"
    >
      <div id="header-wrap" className={`${visible ? 'fixed-header ' : ''}`}>
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col">
              <Navbar className="navbar navbar-expand-lg navbar-light">
                <Link href="/">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <img
                      style={{ width: '50px' }}
                      src="/Logo.png"
                      className="img-fluid"
                      alt="..."
                    />
                    <span
                      style={{
                        fontWeight: '800',
                        fontSize: '24px',
                        marginTop: '5px',
                        color: '#46419c'
                      }}
                    >
                      {' '}
                      <b className="sr-only">IYS </b>
                      Skills Tech
                    </span>
                  </div>
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavDropdown"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  onClick={toggle}
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <Collapse
                  isOpen={isOpen}
                  className="collapse navbar-collapse"
                  navbar
                >
                  <Nav className="ms-auto" navbar>
                    {navLinks.map((navLink, index) => (
                      <NavItem key={index}>
                        {navLink.type && navLink.type === 'subMenu' ? (
                          <ul className="p-0" style={{ listStyle: 'none' }}>
                            <UncontrolledDropdown
                              nav
                              inNavbar
                              isOpen={openMenus.includes(index)}
                              toggle={() => toggleMenu(index)}
                              // Remove the following line to prevent closing on mouse leave
                              // onMouseLeave={closeAllMenus}
                            >
                              {/* remove Neeraj for temp solution */}
                              {navLink.path == 'Neeraj' ? (
                                <div
                                  className="d-flex align-items-center justify-items-between"
                                  style={{ width: '100%' }}
                                >
                                  <NavLink
                                    href={navLink.path}
                                    tag={Link}
                                    onClick={handleNavLinkClick}
                                  >
                                    {navLink.menu_title}
                                  </NavLink>
                                  <DropdownToggle nav caret></DropdownToggle>
                                </div>
                              ) : (
                                <DropdownToggle nav caret>
                                  {navLink.menu_title}
                                </DropdownToggle>
                              )}
                              <DropdownMenu
                                id={`submenu_${index}`}
                                className="dropdown-menu"
                              >
                                {navLink.child_routes &&
                                  navLink.child_routes.map((subNavLink, keys) =>
                                    subNavLink.type &&
                                    subNavLink.type === 'childsubMenu' ? (
                                      <UncontrolledDropdown
                                        inNavbar
                                        className="dropdown-submenu"
                                        key={keys}
                                      >
                                        <DropdownToggle
                                          tag="a"
                                          caret
                                          className="dropdown-item dropdown-toggle cursor-pointe"
                                        >
                                          {subNavLink.menu_title}
                                        </DropdownToggle>
                                        {/* Sub Menu Start */}
                                        <DropdownMenu
                                          id={`childsubmenu_${keys}`}
                                          className="dropdown-menu"
                                        >
                                          {subNavLink.child_routes &&
                                            subNavLink.child_routes.map(
                                              (ChildsubNavLink, i) => (
                                                <DropdownItem
                                                  key={i}
                                                  tag={Link}
                                                  href={ChildsubNavLink.path}
                                                >
                                                  {ChildsubNavLink.menu_title}
                                                </DropdownItem>
                                              )
                                            )}
                                        </DropdownMenu>
                                        {/* Sub Menu End */}
                                      </UncontrolledDropdown>
                                    ) : (
                                      <ul className="list-unstyled" key={keys}>
                                        <li>
                                          <DropdownItem
                                            tag={Link}
                                            href={subNavLink.path}
                                            onClick={handleNavLinkClick} // Close the dropdown on NavLink click
                                          >
                                            {subNavLink.menu_title}
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    )
                                  )}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </ul>
                        ) : (
                          <NavLink
                            href={navLink.path}
                            tag={Link}
                            onClick={handleNavLinkClick}
                          >
                            {navLink.menu_title}
                          </NavLink>
                        )}
                      </NavItem>
                    ))}
                  </Nav>
                  <Link href="/contact" className="ms-3 btn btn-primary active">
                    Contact Us
                  </Link>
                </Collapse>
              </Navbar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;
