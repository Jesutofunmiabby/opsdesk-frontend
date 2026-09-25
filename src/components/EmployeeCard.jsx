import { getInitials } from '../utils/getInitials'
import './EmployeeCard.css'

function EmployeeCard({ employee, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={
        isSelected ? 'employee-card employee-card--selected' : 'employee-card'
      }
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => onSelect(employee)}
    >
      <span className="employee-card__avatar" aria-hidden="true">
        {getInitials(employee.name)}
      </span>
      <span className="employee-card__text">
        <span className="employee-card__name">{employee.name}</span>
        <span className="employee-card__role">{employee.role}</span>
      </span>
      <span className="employee-card__tag">{employee.department}</span>
    </button>
  )
}

export default EmployeeCard
