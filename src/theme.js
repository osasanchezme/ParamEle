import { extendTheme } from "@chakra-ui/react";
import { tagTheme } from "./components/custom_variants/tag";
import { accordionTheme } from "./components/custom_variants/accordion";

const theme = extendTheme({
  components: {
    Tag: tagTheme,
    Accordion: accordionTheme,
  },
});

export default theme;
