// integrationNode.js
import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const IntegrationNode = ({ id, data }) => {
    const [service, setService] = useState(data?.service || 'Slack');

    return (
        <BaseNode
            id={id}
            data={data}
            label="Integration"
            handles={[
                { type: 'target', position: Position.Left, id: `${id}-input` },
                { type: 'source', position: Position.Right, id: `${id}-output` }
            ]}
        >
            <label>
                Service:
                <select value={service} onChange={(e) => setService(e.target.value)}>
                    <option value="Slack">Slack</option>
                    <option value="Discord">Discord</option>
                    <option value="Notion">Notion</option>
                </select>
            </label>
            <div style={{ fontSize: '12px', color: '#666' }}>
                {service} connected via API.
            </div>
        </BaseNode>
    );
};
