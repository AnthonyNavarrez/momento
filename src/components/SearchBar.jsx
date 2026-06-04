import { useState, useEffect } from 'react';
import './SearchBar.css';

function formatDateRange(startDate, endDate) {
    if (startDate && endDate) return `${startDate} – ${endDate}`;
    if (startDate) return `From ${startDate}`;
    return `Until ${endDate}`;
}

export function SearchBar({ onSearch, resultCount, totalCount, initialTags = [], onClear, onTagsChange }) {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState(initialTags);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        setTags(initialTags);
    }, [initialTags.join(',')]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch({ q: query, tags, startDate, endDate });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, tags, startDate, endDate]);

    const clearAll = () => {
        setQuery('');
        setTags([]);
        setStartDate('');
        setEndDate('');
        if (onTagsChange) onTagsChange([]);
        if (onClear) onClear();
    };

    const removeTag = (tag) => {
        const next = tags.filter((t) => t !== tag);
        setTags(next);
        if (onTagsChange) onTagsChange(next);
    };

    const activeFilterCount =
        tags.length + (query ? 1 : 0) + (startDate || endDate ? 1 : 0);
    const isFiltering = activeFilterCount > 0;

    return (
        <div className="searchbar-container">
            <input
                className="input searchbar-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search photos..."
            />
            <div className="searchbar-dates">
                <input
                    className="input searchbar-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    aria-label="Start date"
                />
                <input
                    className="input searchbar-date-input"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    aria-label="End date"
                />
            </div>

            {isFiltering && (
                <div className="searchbar-active-filters">
                    {tags.map((tag) => (
                        <span key={tag} className="searchbar-filter-chip">
                            Tag: {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                aria-label={`Remove tag filter: ${tag}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    {query && (
                        <span className="searchbar-filter-chip">
                            &ldquo;{query}&rdquo;
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                aria-label="Remove search filter"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {(startDate || endDate) && (
                        <span className="searchbar-filter-chip">
                            {formatDateRange(startDate, endDate)}
                            <button
                                type="button"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                aria-label="Remove date filter"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {activeFilterCount >= 2 && (
                        <button type="button" className="searchbar-clear-all" onClick={clearAll}>
                            Clear all
                        </button>
                    )}
                </div>
            )}

            {totalCount > 0 && (
                <p className="searchbar-count">Showing {resultCount} of {totalCount} photos</p>
            )}
        </div>
    );
}
