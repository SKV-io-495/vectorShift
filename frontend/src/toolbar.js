// toolbar.js

import { DraggableNode } from './draggableNode';
import { useTheme } from './ThemeContext';

export const PipelineToolbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

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
                {/* Dark Mode Toggle Button */}
                <button 
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? (
                        // Sun icon for light mode
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        // Moon icon for dark mode
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>
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
