import {useState} from 'react'

export function TagInput({tags, onChange}) {
    const [input, setInput] = useState('')
    function handleInput(e) {
        setInput(e.target.value);
    }
    function handleKeyDown(e) {
        const trimmedInput = e.target.value.trim() 
        if(e.key == 'Enter' && e.target.value && !tags.includes(trimmedInput)) {
            onChange([...tags, trimmedInput])
            setInput('')
        }
    }
    function removeTag(index) {
        onChange(tags.filter((_,i) => i !== index))
    }
    return (
        <div className="tagInput-Container">
            <input value={input} onChange={handleInput} onKeyDown={handleKeyDown}></input>
            <div className="tagChips-Container">
                {tags.map((tag,i) => (
                    <span key={i}>
                        {tag}
                        <button onClick={() => removeTag(i)}>X</button>
                    </span>
                ))}
            </div>
        </div>
    )
}