// BaseNode.js
import { useState, useEffect, useRef } from 'react';
import { Handle } from '@xyflow/react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  removeNode: state.removeNode,
});

// Node type icon configurations
const nodeIcons = {
  customInput: { icon: '📥', class: 'icon-input' },
  llm: { icon: '🤖', class: 'icon-llm' },
  customOutput: { icon: '📤', class: 'icon-output' },
  text: { icon: '📝', class: 'icon-text' },
  note: { icon: '📋', class: 'icon-note' },
  integration: { icon: '🔗', class: 'icon-integration' },
  logic: { icon: '⚡', class: 'icon-logic' },
  file: { icon: '📁', class: 'icon-file' },
  transform: { icon: '🔄', class: 'icon-transform' },
};

export const BaseNode = ({ id, data, label, handles = [], children, style = {} }) => {
  const { removeNode } = useStore(selector, shallow);
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef(null);

  // Get node type from data or id
  const nodeType = data?.nodeType || id.split('-')[0];
  const iconConfig = nodeIcons[nodeType] || { icon: '📦', class: 'icon-input' };

  const handleDeleteClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      timerRef.current = setTimeout(() => {
        setIsConfirming(false);
      }, 5000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      removeNode(id);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="base-node" style={style}>
      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          isConnectable={handle.isConnectable}
        />
      ))}

      {/* Header */}
      <div className="base-node-header">
        <div className={`base-node-header-icon ${iconConfig.class}`}>
          {iconConfig.icon}
        </div>
        <span className="base-node-header-title">{label}</span>
        <div className="base-node-header-actions">
          {/* Settings button placeholder */}
          {/* <button className="base-node-action-btn" title="Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </button> */}
          {/* Delete button */}
          <button
            onClick={handleDeleteClick}
            className={`base-node-action-btn delete ${isConfirming ? 'confirm-delete' : ''}`}
            title={isConfirming ? "Click again to confirm" : "Delete node"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Slot */}
      <div className="base-node-content">
        {children}
      </div>
    </div>
  );
};
