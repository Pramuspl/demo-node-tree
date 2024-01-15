import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  InfoIcon,
  CPUIcon,
} from "./helpers/Icons.js";
import { filterByTerm } from "./helpers/filterByTerm.js";
import { treeNodes } from "./nodes.js";
import "./styles.css";

export default function NestedList({ search }) {
  const [processedNodes, setProcessedNodes] = useState(treeNodes);

  const initialProcessedNodes = useMemo(() => {
    // PERFORMANCE: 0.1-0.15ms
    // console.time("Build Node Tree");
    return buildTree([...treeNodes]);
    // console.timeEnd("Build Node Tree");
  }, [treeNodes]);

  useEffect(() => {
    if (search.length) {
      // PERFORMANCE: First: 0.15-0.2ms, Consecutive <0.05ms
      // console.time("Filter Data");
      const filteredData = filterData(
        initialProcessedNodes,
        filterByTerm,
        search
      );
      // console.timeEnd("Filter Data");

      setProcessedNodes(filteredData);
    } else {
      setProcessedNodes(initialProcessedNodes);
    }
  }, [search]);

  return (
    <div className="border-2 bg-violet-100 border-violet-300">
      <p className="p-2 inline-flex text-violet-600">
        Nested list
        <span
          aria-label="This approach builds a nested tree of items using the recursive algorithm. Then the filtering on each search is ran on the root nodes and recursively on their descendants. The filtering removes the unmatching items, significantly decreasing the size of the DOM tree but could be modified to hide them instead."
          data-balloon-pos="right"
          data-balloon-length="xlarge"
        >
          <InfoIcon className="mx-0.5 cursor-help" />
        </span>
        <span
          aria-label="Building of the tree: ~0.1-0.15ms, filtering: ~0.15-0.2ms for the first run and <0.05ms for the consecutive ones."
          data-balloon-pos="right"
          data-balloon-length="xlarge"
        >
          <CPUIcon className="mx-0.5 cursor-help" />
        </span>
      </p>
      {processedNodes.map((node) => (
        <Item key={node._id} node={node} search={search} />
      ))}
    </div>
  );
}

function Item({ node, processedNodes, search }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => setIsOpen(true), [search?.length]);

  return (
    <div key={node._id} className="ml-6 my-6">
      <div className="flex items-center">
        {!!node.children?.length &&
          (isOpen ? (
            <ChevronRight
              onClick={() => setIsOpen(false)}
              className={"cursor-pointer"}
            />
          ) : (
            <ChevronDown
              onClick={() => setIsOpen(true)}
              className={"cursor-pointer"}
            />
          ))}
        <span
          className={`p-2 ${!node.children?.length && "ml-6"} ${
            search?.length && filterByTerm(node.name, search) && "text-blue-500"
          }
        `}
        >
          {node.name}
        </span>
      </div>
      {isOpen &&
        node.children?.map((childNode) => (
          <Item
            key={childNode._id}
            node={childNode}
            processedNodes={processedNodes}
            search={search}
          />
        ))}
    </div>
  );
}

function filterData(data, filterFunc, search) {
  let newData = [];
  data?.forEach((item) => {
    const newNode = {
      ...item,
      ...(item.children && {
        children: filterData(item.children, filterFunc, search),
      }),
    };
    if (filterByTerm(item.name, search) || newNode.children?.length) {
      newData.push(newNode);
    }
  });
  return newData;
}

function buildTree(nodes) {
  const updatedNodes = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
  return transformToTree(updatedNodes);
}

function transformToTree(list) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i++) {
    map[list[i]._id] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i++) {
    node = list[i];
    if (node.parent !== null) {
      list[map[node.parent]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
