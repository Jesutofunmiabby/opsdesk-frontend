import EmployeeCard from './EmployeeCard'
import './EmployeeList.css'

function EmployeeList({ employees, onSelect }) {
  return (
    <ul className="employee-list">
      {employees.map((employee) => (
        <li key={employee.id}>
          <EmployeeCard employee={employee} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}

export default EmployeeList
