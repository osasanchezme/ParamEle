import React from "react";
import { Box } from "@chakra-ui/react";

function SelectionBox ({visible, x, y, mouse_x, mouse_y}) {
    let width = mouse_x - x;
    let height = mouse_y - y;
    if (width < 0){
        x += width;
        width = -width;
    }
    if (height < 0){
        y += height;
        height = -height;
    }
    if (visible) return <Box bg={"gray.200"} opacity={0.5} position="relative" top={y} left={x} height={height} width={width} zIndex={100}></Box>;
}

export default SelectionBox;
