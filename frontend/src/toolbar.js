// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="pipeline-toolbar">
            {/* Header with branding */}
            <div className="toolbar-header">
                <div className="toolbar-brand">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#6366f1"/>
                    </svg>
                    <span>Pipeline Builder</span>
                </div>
            </div>
            
            {/* Category tabs */}
            <div className="toolbar-tabs">
                <button className="toolbar-tab active">Start</button>
                <button className="toolbar-tab">Data</button>
                <button className="toolbar-tab">AI</button>
                <button className="toolbar-tab">Logic</button>
                <button className="toolbar-tab">Integrations</button>
            </div>
            
            {/* Draggable nodes */}
            <div className="toolbar-nodes">
                <DraggableNode type='customInput' label='Input' icon='📥' iconClass='icon-input' />
                <DraggableNode type='llm' label='LLM' icon='🤖' iconClass='icon-llm' />
                <DraggableNode type='customOutput' label='Output' icon='📤' iconClass='icon-output' />
                <DraggableNode type='text' label='Text' icon='📝' iconClass='icon-text' />
                <DraggableNode type='note' label='Note' icon='📋' iconClass='icon-note' />
                <DraggableNode type='integration' label='Integration' icon='🔗' iconClass='icon-integration' />
                <DraggableNode type='logic' label='Logic' icon='⚡' iconClass='icon-logic' />
                <DraggableNode type='file' label='File' icon='📁' iconClass='icon-file' />
                <DraggableNode type='transform' label='Transform' icon='🔄' iconClass='icon-transform' />
            </div>
        </div>
    );
};
