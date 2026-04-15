function SingleSelectFilter({
  label,
  selectedValue,
  showOptions,
  setShowOptions,
  options,
  onSelect,
  onClear,
}) {
  return (
    <div>
      <button onClick={() => setShowOptions(!showOptions)}>
        {selectedValue === '' ? label : `${label} = ${selectedValue}`}
      </button>

      {showOptions && (
        <div>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setShowOptions(false);
              }}
            >
              {option}
            </button>
          ))}

          <button
            onClick={() => {
              onClear();
              setShowOptions(false);
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default SingleSelectFilter;