import './SearchBox.css'

interface SearchBoxProps {
  value: string
  // Called with the new text on every key press.
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label className="search-box__label" htmlFor="employee-search">
        Search by name
      </label>
      <input
        id="employee-search"
        className="search-box__input"
        type="search"
        placeholder="Start typing a name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default SearchBox
