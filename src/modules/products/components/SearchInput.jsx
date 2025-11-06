function SearchInput({value, onChange}) {
    return (
        <input type="text" 
        placeholder="Buscar por nombre..." 
        className="w-full p-2 border border-gray-300 rounded-lg" 
        value={value}
        onChange={onChange}
        />
    );
}

export default SearchInput;
