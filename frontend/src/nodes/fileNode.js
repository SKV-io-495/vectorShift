// fileNode.js
import { useState, useRef } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const FileNode = ({ id, data }) => {
    const [fileName, setFileName] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file) {
            setFileName(file.name);
            // Store file reference in data if needed
            if (data) {
                data.file = file;
                data.fileName = file.name;
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setFileName(null);
        if (data) {
            data.file = null;
            data.fileName = null;
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <BaseNode
            id={id}
            data={data}
            label="File"
            handles={[
                { type: 'source', position: Position.Right, id: `${id}-value` }
            ]}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                className="nodrag"
            />
            <div 
                className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {fileName ? (
                    <div className="file-selected">
                        <svg className="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="file-name">{fileName}</span>
                        <button className="file-remove-btn" onClick={handleRemoveFile} title="Remove file">
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="file-placeholder">
                        <svg className="upload-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Click or drag file</span>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

