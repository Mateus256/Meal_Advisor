function MultiSelectFilter({
  label,
  selectedValues,
  showOptions,
  setShowOptions,
  options,
  onToggle,
  onClear,
}) {
  return (
    <div>
      <button onClick={() => setShowOptions(!showOptions)}>
        {selectedValues.length === 0
          ? label
          : `${label} = ${selectedValues.join(', ')}`}
      </button>

      {showOptions && (
        <div>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onToggle(option)}
              style={{
                backgroundColor: selectedValues.includes(option)
                  ? 'lightgreen'
                  : 'white',
              }}
            >
              {option}
            </button>
          ))}

          <button onClick={() => setShowOptions(false)}>
            Done
          </button>

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

export default MultiSelectFilter;