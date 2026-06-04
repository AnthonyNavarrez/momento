import { useState } from 'react';
import './TagInput.css';

export function TagInput({ tags, onChange, suggestions = [] }) {
    const [input, setInput] = useState('');

    function handleInput(e) {
        setInput(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedInput = e.target.value.trim();
            if (trimmedInput && !tags.includes(trimmedInput)) {
                onChange([...tags, trimmedInput]);
                setInput('');
            }
        }
    }

    function removeTag(index) {
        onChange(tags.filter((_, i) => i !== index));
    }

    function addSuggestion(tag) {
        if (!tags.includes(tag)) {
            onChange([...tags, tag]);
        }
    }

    return (
        <div className="tag-input-container">
            <div className="tag-chips">
                {tags.map((tag, i) => (
                    <span key={i} className="tag">
                        {tag}
                        <button
                            type="button"
                            className="tag-remove-btn"
                            onClick={() => removeTag(i)}
                            aria-label={`Remove tag ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <input
                className="input tag-text-input"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type a tag and press Enter"
            />
            {suggestions.length > 0 && (
                <div className="tag-suggestions">
                    {suggestions.filter((s) => !tags.includes(s)).map((s) => (
                        <button
                            type="button"
                            key={s}
                            className="tag-suggestion"
                            onClick={() => addSuggestion(s)}
                        >
                            + {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
