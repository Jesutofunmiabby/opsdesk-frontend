import './EmployeeCard.css'

// "Adaeze Okonkwo" -> "AO". Single-word names fall back to one letter.
function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function EmployeeCard({ employee, onSelect }) {
  return (
    <button
      type="button"
      className="employee-card"
      onClick={() => onSelect(employee)}
    >
      <span className="employee-card__avatar" aria-hidden="true">
        {getInitials(employee.name)}
      </span>
      <span className="employee-card__text">
        <span className="employee-card__name">{employee.name}</span>
        <span className="employee-card__department">{employee.department}</span>
      </span>
    </button>
  )
}

export default EmployeeCard
