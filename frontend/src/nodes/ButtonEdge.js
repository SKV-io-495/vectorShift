// ButtonEdge.js
import { useState, useRef, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  removeEdge: state.removeEdge,
});

export const ButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const { removeEdge } = useStore(selector, shallow);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef(null);

  const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    if (!isConfirming) {
        setIsConfirming(true);
        timerRef.current = setTimeout(() => {
            setIsConfirming(false);
        }, 5000);
    } else {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        removeEdge(id);
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
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            title={isConfirming ? "Confirm delete" : "Delete edge"}
            onClick={(event) => onEdgeClick(event, id)}
            style={{
                width: '24px',
                height: '24px',
                background: isConfirming ? '#FF5252' : '#eee',
                border: isConfirming ? '2px solid white' : '1px solid #777',
                cursor: 'pointer',
                borderRadius: '50%',
                fontSize: '12px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isConfirming ? 'white' : '#333',
                transition: 'background 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isConfirming ? '×' : '×'}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
