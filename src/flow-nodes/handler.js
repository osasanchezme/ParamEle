import TextUpdaterNode from "./basicInput"
import SumNumbersNode from "./sumNumbers"

const nodes = {
    textUpdater: TextUpdaterNode,
    sumNumbers: SumNumbersNode.SumNumbers
}

const execution = {
    sumNumbers: SumNumbersNode.Exec
}

const library = {nodes, execution}

export default library