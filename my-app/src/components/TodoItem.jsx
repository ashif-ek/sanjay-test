import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodoText } from '../features/todos/todosSlice';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (editText.trim() !== todo.text) {
      dispatch(updateTodoText({ id: todo.id, text: editText }));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex flex-col p-4 bg-white rounded-xl border border-transparent hover:border-primary-100 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300">
      <div className="flex items-start gap-4 w-full">
        <button 
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`
            mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0
            ${todo.completed 
              ? 'bg-primary-600 border-primary-600 scale-110' 
              : 'border-slate-300 hover:border-primary-500 bg-slate-50'
            }
          `}
        >
          {todo.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="w-full text-base font-medium text-slate-900 bg-transparent border-b-2 border-primary-500 outline-none pb-1"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span 
              onDoubleClick={() => setIsEditing(true)}
              className={`
                text-base font-medium transition-all duration-300 cursor-text select-none block break-words
                ${todo.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}
              `}
              title="Double click to edit"
            >
              {todo.text}
            </span>
          )}
          
          {/* Image Display */}
          {todo.image && (
            <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-100 w-fit max-w-full">
                <img 
                    src={todo.image} 
                    alt="Task attachment" 
                    className={`max-h-48 object-cover transition-opacity duration-300 ${todo.completed ? 'opacity-50 grayscale' : ''}`}
                />
            </div>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 shrink-0"
          aria-label="Delete todo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
