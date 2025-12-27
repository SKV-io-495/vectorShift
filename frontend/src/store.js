// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "@xyflow/react";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  // ✅ Important: functional set so styles are not lost
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  // 🟦 Drawing edges → blue + animated
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          type: "default",
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.Arrow,
            height: "20px",
            width: "20px",
          },
        },
        state.edges
      ),
    }));
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    }));
  },

  removeEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    }));
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node
      ),
    }));
  },

  // 🔴 / 🟢 Highlight edges after submit
  highlightEdges: (isDag, cyclicEdges = []) => {
    set((state) => {
      const cyclicEdgeSet = new Set(cyclicEdges);

      const newEdges = state.edges.map((edge) => {
        let style = { stroke: "#3b82f6", strokeWidth: 2 }; // default blue
        let className = "";
        let animated = false;
        let showCycleLabel = false;

        if (!isDag) {
          // ❌ Pipeline failed
          if (cyclicEdgeSet.has(edge.id)) {
            // 🔴 cyclic edges
            style = { stroke: "#ef4444", strokeWidth: 3 };
            className = "edge-error";
            animated = true;
            showCycleLabel = true;
          } else {
            // ⚪ non-cyclic edges
            style = { stroke: "#94a3b8", strokeWidth: 1.5 };
            animated = false;
          }
        } else {
          // ✅ DAG success → all green
          style = { stroke: "#10b981", strokeWidth: 2.5 };
          className = "edge-success";
          animated = true;
        }

        return {
          ...edge,
          style,
          className,
          animated,
          data: { ...edge.data, showCycleLabel },
        };
      });

      return { edges: newEdges };
    });
  },
}));
