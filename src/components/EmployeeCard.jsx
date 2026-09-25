import './EmployeeCard.css'

// "Adaeze Okonkwo" -> "AO". Single-word names fall back to one letter.
function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

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
