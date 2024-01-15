import React, { useEffect, useMemo, useState } from "react";
import {
  CPUIcon,
  ChevronDown,
  ChevronRight,
  InfoIcon,
} from "./helpers/Icons.js";
import { filterByTerm } from "./helpers/filterByTerm.js";
import { treeNodes } from "./nodes.js";
import "./styles.css";

export default function SortedArray({ search }) {
  const [processedNodes, setProcessedNodes] = useState([]);
  const [forcedVisibilityItems, setForcedVisibilityItems] = useState(new Set());

  useEffect(() => {
    setForcedVisibilityItems(new Set());
    // PERFORMANCE: ~0.03ms
    // console.time("Sorting nodes");
    const sortedNodes = treeNodes.sort((a, b) => a.name.localeCompare(b.name));
    // console.timeEnd("Sorting nodes");

    // PERFORMANCE: ~0.1-0.2ms, max 1-2ms for single character
    // console.time("Filtering nodes");
    if (search.length) {
      const matchingNodes = sortedNodes.filter((node) =>
        filterByTerm(node.name, search)
      );
      matchingNodes.forEach((node) =>
        forceVisibility(node, sortedNodes, setForcedVisibilityItems)
      );
    }
    // console.timeEnd("Filtering nodes");

    setProcessedNodes(sortedNodes);
  }, [search]);

  return (
    <div className="border-2 bg-teal-100 border-teal-300">
      <p className="p-2 inline-flex text-teal-600">
        Sorted flat array
        <span
          aria-label={`"Sorted flat array" keeps the imported list of nodes flat and just sorts it. This approach should theoretically allow relatively faster search (O(log n) instead of O(n)) but requires several more operations including each node having to traverse the entire list of nodes to find its children. On search, it doesn't remove the unmatching items completely but highlights those that do and uncollapses all its parents up until the root.`}
          data-balloon-pos="right"
          data-balloon-length="xlarge"
        >
          <InfoIcon className="mx-0.5 cursor-help" />
        </span>
        <span
          aria-label={
            "Initial sorting of the tree: ~0.03ms for the given dataset, building DOM tree from flat list: ~0.04-0.06ms, Filtering action: ~0.1-0.2ms, at times goes up to 1-2ms."
          }
          data-balloon-pos="right"
          data-balloon-length="xlarge"
        >
          <CPUIcon className="mx-0.5 cursor-help" />
        </span>
      </p>
      {processedNodes.map(
        (node) =>
          node.parent === null && (
            <Item
              key={node._id}
              node={node}
              processedNodes={processedNodes}
              forcedVisibilityItems={forcedVisibilityItems}
              search={search}
            />
          )
      )}
    </div>
  );
}

function Item({ node, processedNodes, forcedVisibilityItems, search }) {
  const [isOpen, setIsOpen] = useState(true);
  const isHighlighted = useMemo(
    () => search?.length && filterByTerm(node.name, search),
    [search]
  );

  const childNodes = useMemo(
    () => processedNodes.filter((childNode) => childNode.parent === node._id),
    [processedNodes]
  );

  useEffect(() => {
    if (forcedVisibilityItems.has(node._id)) {
      setIsOpen(true);
    }
  }, [forcedVisibilityItems]);

  return (
    <div key={node._id} className="ml-6 my-6 ">
      <div className="flex items-center">
        {!!childNodes.length &&
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
          className={`p-2 ${!childNodes.length && "ml-6"} ${
            isHighlighted && "text-blue-500"
          }
        `}
        >
          {node.name}
        </span>
      </div>
      {isOpen &&
        childNodes.map((childNode) => (
          <Item
            key={childNode._id}
            node={childNode}
            processedNodes={processedNodes}
            forcedVisibilityItems={forcedVisibilityItems}
            search={search}
          />
        ))}
    </div>
  );
}

function forceVisibility(node, allNodes, setForcedVisibilityItems) {
  setForcedVisibilityItems((prevSet) => new Set([...prevSet, node._id]));
  const parentNode = allNodes.find((parent) => parent._id === node.parent);
  if (parentNode) {
    forceVisibility(parentNode, allNodes, setForcedVisibilityItems);
  }
}
