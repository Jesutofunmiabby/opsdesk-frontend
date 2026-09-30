import { ALL_DEPARTMENTS } from '../utils/employees'
import './DepartmentFilter.css'

interface DepartmentFilterProps {
  // A department name, or ALL_DEPARTMENTS for no filter.
  value: string
  departments: string[]
  onChange: (value: string) => void
}

function DepartmentFilter({
  value,
  departments,
  onChange,
}: DepartmentFilterProps) {
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
