import test from 'tape'
import sort from './'

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

  console.log(sort(graph))
  t.end()
})
