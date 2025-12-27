// TextNode.js
import { useState, useRef, useEffect, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  edges: state.edges,
  removeEdge: state.removeEdge,
});

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const { edges, removeEdge } = useStore(selector, shallow);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currText]);

  // Handle Logic
  const variables = useMemo(() => {
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    const matches = [...currText.matchAll(regex)];
    const uniqueVars = new Set(matches.map(m => m[1]));
    return Array.from(uniqueVars);
  }, [currText]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  // Validation
  useEffect(() => {
    const invalid = variables.some(v => v.length < 3);
    if (invalid) {
        setError('Variable names must be at least 3 chars.');
    } else {
        setError('');
    }
  }, [variables]);

  // Cleanup Logic
  useEffect(() => {
    // Determine which handles are currently valid
    const validHandles = new Set(variables.map(v => `${id}-${v}`));

    // Find edges connected to handles that no longer exist
    edges.forEach(edge => {
        if (edge.target === id && edge.targetHandle && 
            edge.targetHandle.startsWith(`${id}-`) && // Belongs to this node
            edge.targetHandle !== `${id}-output` &&   // Not the output handle
            !validHandles.has(edge.targetHandle)) {
            removeEdge(edge.id);
        }
    });

  }, [variables, edges, id, removeEdge]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const dynamicHandles = variables.map(variable => {
      const handleId = `${id}-${variable}`;
      // Check if this handle already has a connection
      const isConnected = edges.some(edge => 
        edge.target === id && edge.targetHandle === handleId
      );

      return {
        id: handleId,
        type: 'target',
        position: Position.Left,
        style: { top: '50%', background: '#555' },
        isConnectable: !isConnected // Only allow connection if not already connected
      };
  });

  // Add the output handle
  const allHandles = [
    ...dynamicHandles,
    { id: `${id}-output`, type: 'source', position: Position.Right }
  ];

  return (
    <BaseNode 
      id={id} 
      data={data} 
      label="Text" 
      handles={allHandles}
      style={{ background: '#fff', minWidth: '250px' }} 
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>
            Text:
            <textarea 
              ref={textareaRef}
              value={currText} 
              onChange={handleTextChange} 
              style={{
                  width: '100%',
                  minHeight: '80px',
                  resize: 'none',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '5px',
                  fontFamily: 'monospace',
                  overflow: 'hidden'
              }}
            />
          </label>
          {error && <div style={{ color: 'red', fontSize: '10px' }}>{error}</div>}
      </div>
    </BaseNode>
  );
};
