const sort = graph => {
  const nodeCount = graph.length
  const sorted = []

  while (sorted.length < nodeCount) {
    const item = graph.shift()
    const [ node, dependencies ] = item
    const allDependenciesAreSorted = dependencies.every(dependency => sorted.includes(dependency))
    allDependenciesAreSorted ? sorted.push(node) : graph.push(item)
  }

  return sorted
}

export default sort
