// transformNode.js
import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
    const [operation, setOperation] = useState(data?.operation || 'To Upper Case');

    return (
        <BaseNode
            id={id}
            data={data}
            label="Transform"
            handles={[
                 { type: 'target', position: Position.Left, id: `${id}-input` },
                 { type: 'source', position: Position.Right, id: `${id}-output` }
            ]}
        >
             <label>
                Operation:
                <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                    <option value="To Upper Case">To Upper Case</option>
                    <option value="To Lower Case">To Lower Case</option>
                    <option value="JSON Stringify">JSON Stringify</option>
                    <option value="JSON Parse">JSON Parse</option>
                </select>
            </label>
        </BaseNode>
    );
};
