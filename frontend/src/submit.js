// submit.js
import { useStore } from './store';

export const SubmitButton = () => {
    const handleSubmit = async () => {
        const { nodes, edges, highlightEdges } = useStore.getState();

        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
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

            // Display alert with results
            alert(`Parsed Pipeline:\nNumber of Nodes: ${data.num_nodes}\nNumber of Edges: ${data.num_edges}\nIs DAG: ${data.is_dag}`);

            // Update edge styles based on DAG result
            highlightEdges(data.is_dag);

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Failed to parse pipeline. Please try again.');
        }
    };

    return (
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
    );
}
