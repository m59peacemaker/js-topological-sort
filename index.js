const Sort = graph => {
  const graphQueue = graph.slice(0)
  const graphSize = graph.length
  const sortedNodes = new Set()
  const deadEndNodes = new Set()
  const unreachableNodes = new Set()
  let candidatesSinceANodeWasSorted = 0

  const isNonTraversableEdge = edge => deadEndNodes.has(edge) || unreachableNodes.has(edge)

  function* sorter () {
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
          candidatesSinceANodeWasSorted = 0
          yield node
        } else {
          ++candidatesSinceANodeWasSorted
          if (candidatesSinceANodeWasSorted === graphQueue.length) {
            const [ cyclicNode, cyclicNodeEdges ] = graphQueue.slice(-1)[0]
            const cycleDescription = `Node:\n  ${cyclicNode}\nEdges:\n  ${cyclicNodeEdges}`
            throw new Error(`cycle found on in graph.\n${cycleDescription}`)
          }
          graphQueue.push(graphItem)
        }
      }
    }

    return sortedNodes
  }

  return Object.assign(sorter(), {
    graphQueue,
    sortedNodes,
    deadEndNodes
  })
}

export default Sort
