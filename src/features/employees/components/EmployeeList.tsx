import EmployeeCard from './EmployeeCard'
import type { Employee } from '../types'
import './EmployeeList.css'

interface EmployeeListProps {
  employees: Employee[]
  // The open employee's id, or null when none is open.
  selectedId: number | null
  onSelect: (employee: Employee) => void
}

function EmployeeList({ employees, selectedId, onSelect }: EmployeeListProps) {
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
