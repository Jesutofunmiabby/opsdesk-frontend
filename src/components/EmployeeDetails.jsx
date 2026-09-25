import './EmployeeDetails.css'

function EmployeeDetails({ employee, onClose }) {
  return (
    <aside
      className="employee-details"
      aria-label={`Details for ${employee.name}`}
    >
      <div className="employee-details__top">
        <h2 className="employee-details__name">{employee.name}</h2>
        <button
          type="button"
          className="employee-details__close"
          onClick={onClose}
          aria-label="Close details"
        >
          &times;
        </button>
      </div>
      <p className="employee-details__role">{employee.role}</p>
      <dl className="employee-details__fields">
        <dt>Department</dt>
        <dd>{employee.department}</dd>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${employee.email}`}>{employee.email}</a>
        </dd>
        <dt>Phone</dt>
        <dd>
          <a href={`tel:${employee.phone.replace(/[^+\d]/g, '')}`}>
            {employee.phone}
          </a>
        </dd>
      </dl>
    </aside>
  )
}

export default EmployeeDetails
