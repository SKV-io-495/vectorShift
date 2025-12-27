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
        const { nodes, edges } = get();
        
        if (!isDag) {
            set({
                edges: edges.map(edge => ({
                    ...edge,
                    animated: false,
                    style: {}, // Revert to default
                }))
            });
            return;
        }

        // BFS to determine distance from sources
        const adj = {};
        const inDegree = {};
        nodes.forEach(node => {
            adj[node.id] = [];
            inDegree[node.id] = 0;
        });

        edges.forEach(edge => {
            if (adj[edge.source]) {
                 adj[edge.source].push(edge.target);
                 inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
            }
        });

        const queue = nodes.filter(node => inDegree[node.id] === 0).map(node => ({ id: node.id, level: 0 }));
        const nodeLevels = {};
        
        // If there are no nodes with 0 in-degree but it is a DAG (e.g. disconnected components?), 
        // we might miss some. But for visualization, starting from sources is standard.
        // For components without sources (cycles), we wouldn't be here (isDag is true).
        
        while (queue.length > 0) {
            const { id, level } = queue.shift();
            nodeLevels[id] = level;

            if (adj[id]) {
                adj[id].forEach(neighbor => {
                    // We only visit if we haven't or if we found a longer path? 
                    // Simple BFS is fine for alternating colors.
                    // To ensure we process each edge once based on the source level:
                    if (nodeLevels[neighbor] === undefined) {
                         queue.push({ id: neighbor, level: level + 1 });
                         nodeLevels[neighbor] = level + 1;
                    }
                });
            }
        }

        const newEdges = edges.map(edge => {
            const sourceLevel = nodeLevels[edge.source] || 0;
            const isEvenLevel = sourceLevel % 2 === 0;
            const color = isEvenLevel ? '#0000FF' : '#008000'; // Blue : Green

            return {
                ...edge,
                animated: true,
                style: { stroke: color, strokeWidth: 2 },
            };
        });

        set({ edges: newEdges });
    },
  }));
