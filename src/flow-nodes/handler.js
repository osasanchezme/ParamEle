import InputNumberNode from "./basicInput"
import SumNumbersNode from "./sumNumbers"

const nodes = {
    inputNumber: InputNumberNode,
    sumNumbers: SumNumbersNode.SumNumbers
}

const mapping = {
    "Número": "inputNumber",
    "Nodo": "inputNumber",
    "Elemento": "inputNumber",
    "Duplicar": "inputNumber",
    "Resolver": "inputNumber",
    "Exportar": "inputNumber",
    "Correr": "inputNumber",
    "Leer": "inputNumber",
    "Importar": "inputNumber",
    "Suma de números": "sumNumbers"
}

const execution = {
    sumNumbers: SumNumbersNode.Exec
}

const library = {nodes, execution, mapping}

export default library