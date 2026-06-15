import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = 'Search...', value = '', className = '' }) => {
  const [query, setQuery] = useState(value);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <FiSearch className="absolute left-4 text-dark-300" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-dark pl-11 pr-10"
      />
      {query && (
        <button type="button" onClick={() => { setQuery(''); onSearch(''); }} className="absolute right-4 text-dark-300 hover:text-white">
          <FiX />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
