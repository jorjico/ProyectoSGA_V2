import { Link as RouterLink } from 'react-router-dom';
import BotonLogout from './BotonLogout.jsx';
import menuOpciones from '../data/menuOpciones.js';
import { Box, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import { HamburgerIcon } from "@chakra-ui/icons";
import NavbarStyle from '../theme/navbarStyle.js';
import { useRef, useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext.jsx';

function Navbar() {
    const { usuario } = useContext(UsuarioContext);
    const { isOpen, onToggle, onClose } = useDisclosure();
    const mobileMenuRef = useRef();

    useOutsideClick({
        ref: mobileMenuRef,
        handler: () => {
            if(isOpen) onClose();
        },
    });

    const menuOpcionesFiltradas = menuOpciones.filter((seccion) => {
        if (seccion.label === "Usuarios" && usuario.rol !== "admin") {
            return false;
        }
        return true;
    });


    return (
        <Box __css={NavbarStyle.container}>

            <Flex sx={NavbarStyle.desktopMenu}>
                
                <Box sx={NavbarStyle.izquierda}>
                    <RouterLink to="/">
                        <Image src="/icon.png" alt="Logo" sx={NavbarStyle.logo}/>
                    </RouterLink>
                </Box>

                <Box sx={NavbarStyle.centro}>
                    <HStack spacing={8}>        
                        {menuOpcionesFiltradas.map((seccion) => (
                            <Menu key={seccion.label}>
                                <MenuButton sx={NavbarStyle.MenuButton}>
                                    {seccion.label}
                                </MenuButton>

                                <MenuList>
                                    {seccion.items.map((item) => (
                                        <MenuItem 
                                            key={item.path} 
                                            as={RouterLink} 
                                            to={item.path}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        ))}
                    </HStack>
                </Box>

                <Box sx={NavbarStyle.derecha}>
                    <BotonLogout />
                </Box>
            </Flex>

            <Flex sx={NavbarStyle.mobileMenu}>
                <Box sx={NavbarStyle.mobileContenedorMenuDesplegable} ref={mobileMenuRef}>
                    {!isOpen && (
                        <IconButton
                            aria-label="Abrir menú"
                            icon={<HamburgerIcon />}
                            onClick={onToggle}
                        />      
                    )}


                    {isOpen && (
                        <Box sx={NavbarStyle.mobileMenuDesplegable}>
                            {menuOpcionesFiltradas.map((seccion) => (
                                <Menu key={seccion.label} isLazy>

                                    <MenuButton sx={NavbarStyle.mobileMenuItem}>
                                        {seccion.label}
                                    </MenuButton>
                                    
                                    <MenuList>
                                        {seccion.items.map((item) => (
                                        <MenuItem
                                            key={item.path}
                                            as={RouterLink}
                                            to={item.path}
                                            onClick={onClose}
                                        >
                                            {item.label}
                                        </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            ))}

                            <BotonLogout sx={NavbarStyle.mobileLogout} />
                        </Box>
                    )}
                </Box>

                <RouterLink to="/">
                    <Image src="/icon.png" alt="Logo" sx={NavbarStyle.logo}/>
                </RouterLink>
            </Flex>   
        </Box>
    );
}

export default Navbar;