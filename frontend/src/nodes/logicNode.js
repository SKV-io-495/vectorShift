// logicNode.js
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const LogicNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Logic"
            handles={[
                { type: 'target', position: Position.Left, id: `${id}-input` },
                { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '35%' } },
                { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '65%' } }
            ]}
        >
            <div style={{ textAlign: 'center' }}>
                <span>IF condition</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '10px' }}>
                <span style={{ marginRight: '-5px', marginTop: '-15px' }}>True</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '10px' }}>
                <span style={{ marginRight: '-5px', marginTop: '15px' }}>False</span>
            </div>
        </BaseNode>
    );
};
