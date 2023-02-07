import InputNumberNode from "./basicInput"
import SumNumbersNode from "./sumNumbers"
import MultiplyNumbersNode from "./multiplyNumbers"
import DivideNumbersNode from "./divideNumbers"

const nodes = {
    inputNumber: InputNumberNode,
    sumNumbers: SumNumbersNode.SumNumbers,
    multiplyNumbers: MultiplyNumbersNode.MultiplyNumbers,
    divideNumbers: DivideNumbersNode.DivideNumbers
}

const mapping = {
    "Número": "inputNumber",
    "Suma de números": "sumNumbers",
    "Multiplicación de números": "multiplyNumbers",
    "División de números": "divideNumbers"
}

const execution = {
    sumNumbers: SumNumbersNode.Exec,
    multiplyNumbers: MultiplyNumbersNode.Exec,
    divideNumbers: DivideNumbersNode.Exec
}

const library = {nodes, execution, mapping}

export default library