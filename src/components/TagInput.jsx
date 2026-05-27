import {useState} from 'react'
import './TagInput.css'

export function TagInput({tags, onChange, suggestions = []}) {
    const [input, setInput] = useState('')
    function handleInput(e) {
        setInput(e.target.value);
    }
    function handleKeyDown(e) {
        const trimmedInput = e.target.value.trim()
        if(e.key == 'Enter' && e.target.value && !tags.includes(trimmedInput)) {
            e.preventDefault()
            onChange([...tags, trimmedInput])
            setInput('')
        }
    }
    function removeTag(index) {
        onChange(tags.filter((_,i) => i !== index))
    }
    function addSuggestion(tag) {
        if (!tags.includes(tag)) {
            onChange([...tags, tag])
        }
    }
    return (
        <div className="tag-input-container">
            <div className="tag-chips">
                {tags.map((tag,i) => (
                    <span key={i} className="tag-chip">
                        {tag}
                        <button type="button" onClick={() => removeTag(i)}>×</button>
                    </span>
                ))}
            </div>
            <input
                className="tag-text-input"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type a tag and press Enter"
            />
            {suggestions.length > 0 && (
                <div className="tag-suggestions">
                    {suggestions.filter(s => !tags.includes(s)).map((s) => (
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
    )
}