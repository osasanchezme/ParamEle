import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tagAnatomy.keys);

const common_tag = { bg: "gray.100", color: "gray.600", px: 1, py: 0, fontSize: 8 };

const targetTypeTag = definePartsStyle({
  container: { ...common_tag },
});

const targetTypeTagBig = definePartsStyle({
  container: {
    ...common_tag,
    fontSize: 12,
  },
});

const sourceTypeTag = definePartsStyle({
  container: {
    ...common_tag,
    bg: "gray.300",
  },
});

const sourceTypeTagBig = definePartsStyle({
  container: {
    ...common_tag,
    bg: "gray.300",
    fontSize: 12,
  },
});

export const tagTheme = defineMultiStyleConfig({
  variants: {
    target: targetTypeTag,
    targetBig: targetTypeTagBig,
    source: sourceTypeTag,
    sourceBig: sourceTypeTagBig,
  },
});
