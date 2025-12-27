// submit.js
import React, { useState } from 'react';
import { useStore } from './store';
import { ResultModal } from './ResultModal';

export const SubmitButton = () => {
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        const { nodes, edges, highlightEdges } = useStore.getState();

        try {
            const response = await fetch(process.env.REACT_APP_API_URL || 'http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Set modal data and open it
            setModalData(data);
            setIsModalOpen(true);

            // Update edge styles based on DAG result
            highlightEdges(data.is_dag, data.cyclic_edges);

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Failed to parse pipeline. Please try again.');
        }
    };

    return (
        <>
            <div className="submit-section">
                <button 
                    type="submit" 
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Submit Pipeline
                </button>
            </div>
            
            <ResultModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                results={modalData}
            />
        </>
    );
}
