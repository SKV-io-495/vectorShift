// ResultModal.js
import React from 'react';

export const ResultModal = ({ isOpen, onClose, results }) => {
    if (!isOpen) return null;

    const { is_dag, num_nodes, num_edges } = results;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Pipeline Analysis</h3>
                </div>
                
                <div className="modal-body">
                    <div className="status-row">
                        <span className="status-label">DAG Status:</span>
                        <div className={`status-badge ${is_dag ? 'success' : 'error'}`}>
                            {is_dag ? (
                                <>
                                    <div className="status-dot green"></div>
                                    <span>Is DAG: True</span>
                                </>
                            ) : (
                                <>
                                    <div className="status-icon red">✕</div>
                                    <span>Is DAG: False</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Nodes</span>
                            <span className="stat-value">{num_nodes}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Edges</span>
                            <span className="stat-value">{num_edges}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-btn secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
