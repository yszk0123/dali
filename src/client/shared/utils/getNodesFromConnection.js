/* @flow */
import { uniqBy } from 'lodash';

type Connection<T> = ?{
  +edges: ?$ReadOnlyArray<Edge<T>>,
};

type Edge<T> = ?{
  +node: ?T,
};

function getNodeFromEdges<T>(edges: $ReadOnlyArray<?Edge<T>>): Array<T> {
  const result: Array<T> = [];

  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    if (edge && edge.node) {
      result.push(edge.node);
    }
  }

  // FIXME: workaround for duplicate node issue
  const uniqueResult = uniqBy(result, 'id');

  return uniqueResult;
}

export default function getNodesFromConnection<T>(
  connection: Connection<T>,
): Array<T> {
  if (!connection) {
    return [];
  }

  const { edges } = connection;
  if (!edges) {
    return [];
  }

  return getNodeFromEdges(edges);
}
