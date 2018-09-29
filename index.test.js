import test from 'tape'
import Sort from './'

const incomingEdgesPrecedeNode = (callback, graph, sorted) => {
  const graphMap = new Map(graph)
  sorted.forEach((node, nodeIndex) => {
    graphMap.get(node).forEach(incomingEdge => {
      callback(node, nodeIndex > sorted.indexOf(incomingEdge))
    })
  })
}

test('sort', t => {
  const graph = [
    [ 10, [ 3, 11 ] ],
    [ 3, [ ] ],
    [ 5, [ ] ],
    [ 11, [ 7, 5 ] ],
    [ 8, [ 3, 7 ] ],
    [ 7, [ ] ],
    [ 9, [ 11, 8 ] ],
    [ 2, [ 11 ] ]
  ]

  const sorted = [ ...Sort(graph) ]

  incomingEdgesPrecedeNode(
    (node, pass) => t.true(pass, node),
    graph,
    sorted
  )

  t.end()
})

test('sort with unreachable nodes', t => {
  const graph = [
    [ 1, [ ] ],
    [ 2, [ 1 ] ],
    [ 3, [ 2 ] ],
    [ 9, [ ] ],
    [ 7, [ 6 ] ],
    [ 4, [ 3 ] ],
    [ 5, [ 2, 3, 4 ] ],
    [ 6, [ ] ],
    [ 10, [ 1, 2, 3, 4 ] ]
  ]

  const sort = Sort(graph)
  sort.deadEndNodes.add(2)
  const sorted = [ ...sort ]

  incomingEdgesPrecedeNode(
    (node, pass) => t.true(pass, node),
    graph,
    sorted
  )

  // specific order is not necessarily important beyond generally topological sort
  // it's ok if this changes in that way
  t.deepEqual(sorted, [ 1, 2, 9, 6, 10, 7 ])

  t.end()
})
