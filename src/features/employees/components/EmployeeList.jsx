import EmployeeCard from './EmployeeCard'
import './EmployeeList.css'

function EmployeeList({ employees, selectedId, onSelect }) {
  return (
    <ul className="employee-list">
      {employees.map((employee) => (
        <li key={employee.id}>
          <EmployeeCard
            employee={employee}
            isSelected={employee.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  )
}

export default EmployeeList
