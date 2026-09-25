import './DepartmentFilter.css'

// The value that means "do not filter by department". Exported so App can
// compare against it without repeating the string.
export const ALL_DEPARTMENTS = 'all'

function DepartmentFilter({ value, departments, onChange }) {
  return (
    <div className="department-filter">
      <label className="department-filter__label" htmlFor="department-filter">
        Department
      </label>
      <select
        id="department-filter"
        className="department-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={ALL_DEPARTMENTS}>All departments</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DepartmentFilter
