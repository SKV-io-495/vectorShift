// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from '@xyflow/react';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'default', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    removeNode: (id) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== id),
            edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
    },
    removeEdge: (id) => {
        set({
            edges: get().edges.filter((edge) => edge.id !== id),
        });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            // it's important to create a new object to notify react flow about the change
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue },
            };
          }
  
          return node;
        }),
      });
    },
    highlightEdges: (isDag) => {
        const { edges } = get();
        
        if (!isDag) {
            // Cycle detected - apply red-purple alternating error colors with cycle label
            const newEdges = edges.map((edge, index) => {
                const isEven = index % 2 === 0;
                const color = isEven ? '#ef4444' : '#a855f7'; // Red : Purple
                
                return {
                    ...edge,
                    animated: true,
                    className: 'edge-error',
                    style: { stroke: color, strokeWidth: 3 },
                    data: { ...edge.data, showCycleLabel: true },
                };
            });
            set({ edges: newEdges });
            return;
        }

        // DAG is valid - apply solid blue success color
        const newEdges = edges.map(edge => ({
            ...edge,
            animated: true,
            className: 'edge-success',
            style: { stroke: '#3b82f6', strokeWidth: 2.5 },
            data: { ...edge.data, showCycleLabel: false },
        }));

        set({ edges: newEdges });
    },
  }));
