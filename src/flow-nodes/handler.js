import TextUpdaterNode from "./basicInput"
import SumNumbersNode from "./sumNumbers"

const nodes = {
    textUpdater: TextUpdaterNode,
    sumNumbers: SumNumbersNode.SumNumbers
}

const mapping = {
    "Entrada de texto": "textUpdater",
    "Nodo": "textUpdater",
    "Elemento": "textUpdater",
    "Duplicar": "textUpdater",
    "Resolver": "textUpdater",
    "Exportar": "textUpdater",
    "Correr": "textUpdater",
    "Leer": "textUpdater",
    "Importar": "textUpdater",
    "Suma de números": "sumNumbers"
}

const execution = {
    sumNumbers: SumNumbersNode.Exec
}

const library = {nodes, execution, mapping}

export default library