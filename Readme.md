#Challenge:

- nodes.js contains an array with nodes of a tree (parent: null are 'root' nodes)
- can you visualize the tree?
- if a node has children it should be 'collapsible' (so you can't see the children)
- above the tree a search box should be present, where you can dynamically filter for the name of the tree nodes
- when a query is filled in, all children that match the query should be visible (if matched node is in a collapsed part of the tree, the parents should uncollapse)
- pure react, without using a lot of extra packages (e.g. no 'react-tree-view')
- use a good component structure (functional components).

#Example:
Tree:

- Root
  - Child A
    - Grandchild A1
    - Grandchild A2
  - Child B
    - Grandchild B1
    - Grandchild B2

Search: []

- Root

Search: [A]

- Root
  - Child A
    - Grandchild A1
    - Grandchild A2

Search: [B1]

- Root
  - Child B
    - Grandchild B1
