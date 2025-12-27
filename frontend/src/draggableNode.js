// draggableNode.js

export const DraggableNode = ({ type, label, icon, iconClass }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="draggable-node"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
        <div className={`draggable-node-icon ${iconClass || ''}`}>
          {icon || '📦'}
        </div>
        <span className="draggable-node-label">{label}</span>
      </div>
    );
  };