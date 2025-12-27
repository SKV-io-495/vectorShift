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
                { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '70%' } }
            ]}
            style={{ width: '280px' }}
        >
            <div className="logic-node-layout">
                <div className="logic-condition-box">
                    <span>IF condition</span>
                </div>
                <div className="logic-outputs-column">
                    <div className="logic-output-btn true">
                        True
                    </div>
                    <div className="logic-output-btn false">
                        False
                    </div>
                </div>
            </div>
        </BaseNode>
    );
};

