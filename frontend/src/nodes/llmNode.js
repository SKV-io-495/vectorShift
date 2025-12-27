// llmNode.js

import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="LLM"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: '40%' } },
        { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: '70%' } },
        { type: 'source', position: Position.Right, id: `${id}-response` }
      ]}
    >
      <div className="llm-node-content">
        <div className="llm-inputs">
          <div className="llm-input-row">
            <span className="llm-input-label">System</span>
          </div>
          <div className="llm-input-row">
            <span className="llm-input-label">Prompt</span>
          </div>
        </div>
        <div className="llm-description">
          <span>Large Language Model</span>
        </div>
      </div>
    </BaseNode>
  );
}

