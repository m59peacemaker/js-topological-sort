/*
edgeMap[node].push(edge)
api to keep or remove edge?
*/

/*
const sorter = Sorter(edges)
*/

// Adaptive Topological Sort

// need to distinguish between top level nodes
// and nodes that require edges, but have only dead-end edges

// TODO: record which edges lead to node (by excluding the dead ones)
// but that may not be this operation's responsibility
// probably the consumer of the nodes could:
// node.edges.filter(edge => !sort.unreachableNodes.includes(edge))
// and that state could even be maintained outside

const Sort = graph => {
  const graphQueue = graph.slice(0)
  const graphSize = graph.length
  const sortedNodes = new Set()
  const deadEndNodes = new Set()
  const unreachableNodes = new Set()

  const isNonTraversableEdge = edge => deadEndNodes.has(edge) || unreachableNodes.has(edge)

  function* sort () {
    while (sortedNodes.size < (graphSize - unreachableNodes.size)) {
      const graphItem = graphQueue.shift()
      const [ node, incomingEdges ] = graphItem
      const isSourceNode = incomingEdges.length === 0
      const isUnreachable = !isSourceNode && incomingEdges.every(isNonTraversableEdge)

      if (isUnreachable) {
        unreachableNodes.add(node)
      } else {
        const allTraversableEdgesAreSorted = incomingEdges
          .filter(edge => !isNonTraversableEdge(edge))
          .every(edge => sortedNodes.has(edge))
        if (allTraversableEdgesAreSorted) {
          sortedNodes.add(node)
          yield node
        } else {
          graphQueue.push(graphItem)
        }
      }
    }

    return sortedNodes
  }

  return Object.assign(sort(), {
    graphQueue,
    sortedNodes,
    deadEndNodes
  })
}

export default Sort
