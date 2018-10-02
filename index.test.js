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
    (node, pass) => t.true(pass),
    graph,
    sorted
  )

  t.end()
})

test('sort with dead end nodes', t => {
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
    (node, pass) => t.true(pass),
    graph,
    sorted
  )

  // specific order is not necessarily important beyond generally topological sort
  // it's ok if this changes in that way
  t.deepEqual(sorted, [ 1, 2, 9, 6, 10, 7 ])

  t.end()
})

test('cyclic graph, basic', t => {
  const graph = [
    [ 1, [ ] ],
    [ 2, [ 1 ] ]
  ]
  const cyclicGraph = [
    [ 1, [ 2 ] ],
    [ 2, [ 1 ] ]
  ]

  // sanity check
  incomingEdgesPrecedeNode(
    (node, pass) => t.true(pass, 'sanity check'),
    graph,
    [ ...Sort(graph) ]
  )

  const sort = Sort(cyclicGraph)

  t.throws(() => [ ...sort ], 'cyclic graph threw error')

  t.end()
})

test('cyclic graph, complex', t => {
  const graph = [
    [ 1, [ ] ],
    [ 2, [ 1 ] ],
    [ 7, [ ] ],
    [ 5, [ ] ],
    [ 4, [ 2, 1 ] ],
    [ 3, [ ] ],
    [ 6, [ 5, 2, 4 ] ]
  ]
  const cyclicGraph = [
    [ 1, [ 4 ] ],
    [ 2, [ 1 ] ],
    [ 7, [ ] ],
    [ 5, [ 6 ] ]
    [ 4, [ 2, 1 ] ],
    [ 3, [ ] ],
    [ 6, [ 5, 2, 4 ] ]
  ]

  // sanity check
  incomingEdgesPrecedeNode(
    (node, pass) => t.true(pass, 'sanity check'),
    graph,
    [ ...Sort(graph) ]
  )

  const sort = Sort(cyclicGraph)

  t.throws(() => [ ...sort ], 'cyclic graph threw error')

  t.end()
})
