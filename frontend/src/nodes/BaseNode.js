// BaseNode.js
import { useState, useEffect, useRef } from 'react';
import { Handle } from '@xyflow/react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  removeNode: state.removeNode,
});

export const BaseNode = ({ id, data, label, handles = [], children, style = {} }) => {
  const { removeNode } = useStore(selector, shallow);
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef(null);

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
    <div style={{ 
      width: 200, 
      height: 'auto', 
      border: '1px solid black', 
      background: 'white',
      borderRadius: '8px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      position: 'relative',
      ...style 
    }}>
      {/* Delete Button */}
       <button
        onClick={handleDeleteClick}
        title={isConfirming ? "Confirm delete" : "Delete node"}
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          zIndex: 10,
        }}
      >
        {isConfirming ? (
            // Red Cross for Confirm
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FF5252"/>
                <path d="M16 8L8 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 8L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ) : (
            // Default Delete Icon
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="white" stroke="#333" strokeWidth="1"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                {/* Visual trick: make it look like 'x' on hover via CSS or just keep simple 'x' */}
                {/* Actually let's just use a standard looking 'x' or trash icon. Using 'x' for consistency with request. */}
                <path d="M15 9L9 15" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 9L15 15" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        )}
      </button>

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

      {/* Header / Label */}
      {label && (
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
          {label}
        </div>
      )}

      {/* Content Slot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {children}
      </div>
    </div>
  );
};
