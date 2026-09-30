import './SearchBox.css'

function SearchBox({ value, onChange }) {
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
