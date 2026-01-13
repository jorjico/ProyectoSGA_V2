import { useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button, Image } from "@chakra-ui/react";

function FiltroSelect({ label, options = [], value, onChange, placeholder, sx }) {
    const [selected, setSelected] = useState(value || "");

    const handleSelect = (val) => {
        setSelected(val);
        onChange(val);
    };

    const displayLabel = selected
        ? options.find(opt => (opt.value || opt) === selected)?.label || selected
        : placeholder || `Filtrar por ${label}`;

    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<Image src="/desplegable.png" {...sx.icon}/>}
                {...sx}
            >
                {displayLabel}
            </MenuButton>
            <MenuList borderRadius="md" borderWidth="1px" borderColor={sx?.borderColor || "gray.300"} bg={sx?.bg || "white"}>
                {options.map(opt => (
                    <MenuItem
                        key={opt.value || opt}
                        onClick={() => handleSelect(opt.value || opt)}
                        _hover={{ bg: sx?._hoverBg || "gray.100" }}
                    >
                        {opt.label || opt}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

export default FiltroSelect;