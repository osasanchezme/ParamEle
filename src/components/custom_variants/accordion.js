import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const parent = definePartsStyle({
  button: {
    padding: "4px"
  },
  icon: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.200',
    borderRadius: 'full',
    color: 'gray.500',
  },
  panel: {
    padding: "0px",
    paddingLeft: "10px",
    paddingRight: "5px",
  }
})

const child = definePartsStyle({
    button: {
      padding: "2px",
      fontSize: "12px",
    },
    icon: {
      border: '1px solid',
      borderColor: 'gray.200',
      background: 'gray.200',
      borderRadius: 'full',
      color: 'gray.500',
    },
  })

export const accordionTheme = defineMultiStyleConfig({
  variants: { parent, child },
})