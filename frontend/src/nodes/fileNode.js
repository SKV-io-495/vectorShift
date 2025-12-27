// fileNode.js
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const FileNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="File"
            handles={[
                { type: 'source', position: Position.Right, id: `${id}-value` }
            ]}
        >
            <div style={{ padding: '5px', background: '#f5f5f5', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px' }}>Click to upload</span>
            </div>
        </BaseNode>
    );
};
