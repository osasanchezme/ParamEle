import TextUpdaterNode from "./basicInput"
import SumNumbersNode from "./sumNumbers"

const nodes = {
    textUpdater: TextUpdaterNode,
    sumNumbers: SumNumbersNode.SumNumbers
}

const mapping = {
    "Entrada de texto": "textUpdater",
    "Suma de números": "sumNumbers"
}

const execution = {
    sumNumbers: SumNumbersNode.Exec
}

const library = {nodes, execution, mapping}

export default library