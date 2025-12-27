// noteNode.js
import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      label="Note"
      handles={[]} 
      style={{ background: '#fff9c4' }} 
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <textarea 
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder="Type your note here..."
            style={{ 
                border: 'none', 
                background: 'transparent', 
                resize: 'none', 
                outline: 'none', 
                width: '100%', 
                minHeight: '60px',
                fontFamily: 'inherit',
                overflow: 'hidden'
            }}
        />
      </div>
    </BaseNode>
  );
};
