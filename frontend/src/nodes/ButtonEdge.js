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
  data,
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

  // Check if we should show cycle label
  const showCycleLabel = data?.showCycleLabel;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {/* Cycle Detected Label */}
        {showCycleLabel && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 20}px)`,
              pointerEvents: 'none',
            }}
            className="nodrag nopan"
          >
            <span className="cycle-detected-label">⚠ Cycle Detected</span>
          </div>
        )}
        
        {/* Delete Button */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + (showCycleLabel ? 10 : 0)}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            title={isConfirming ? "Confirm delete" : "Delete edge"}
            onClick={(event) => onEdgeClick(event, id)}
            className={`edge-delete-btn ${isConfirming ? 'confirm' : ''}`}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
