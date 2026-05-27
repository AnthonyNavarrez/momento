import { useState, useEffect } from 'react';
import './SearchBar.css';

export function SearchBar({ onSearch, resultCount, totalCount, initialTags = [], onClear }) {
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

    const clearFilters = () => {
        setQuery('');
        setTags([]);
        setStartDate('');
        setEndDate('');
        if (onClear) onClear();
    };

    const isFiltering = query || tags.length > 0 || startDate || endDate;

    return (
        <div className="searchbar-container">
            <input
                className="searchbar-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search photos..."
            />
            <div className="searchbar-dates">
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </div>
            {isFiltering && (
                <button className="searchbar-clear" onClick={clearFilters}>Clear filters</button>
            )}
            {totalCount > 0 && (
                <p className="searchbar-count">Showing {resultCount} of {totalCount} photos</p>
            )}
        </div>
    );
}
