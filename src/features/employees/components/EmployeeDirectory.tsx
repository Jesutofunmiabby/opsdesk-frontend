import { useState } from 'react'
import employees from '../data/employees'
import EmployeeList from './EmployeeList'
import EmployeeDetails from './EmployeeDetails'
import SearchBox from './SearchBox'
import DepartmentFilter from './DepartmentFilter'
import {
  ALL_DEPARTMENTS,
  getDepartments,
  filterEmployees,
} from '../utils/employees'
import type { Employee } from '../types'
import './EmployeeDirectory.css'

// Computed once outside the component: the data never changes.
const departments = getDepartments(employees)

// Search, department filter, the matching employees, and the details of the
// one that is open.
function EmployeeDirectory() {
  // Without the type, TypeScript would decide from null that this can only
  // ever be null.
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )
  const [nameQuery, setNameQuery] = useState('')
  const [department, setDepartment] = useState(ALL_DEPARTMENTS)

  // Derived from state during render, not stored in state of its own.
  const visibleEmployees = filterEmployees(employees, nameQuery, department)

  function handleSelect(employee: Employee) {
    setSelectedEmployee(employee)
  }

  function handleClose() {
    setSelectedEmployee(null)
  }

  return (
    <div>
      <div className="employee-directory__controls">
        <SearchBox value={nameQuery} onChange={setNameQuery} />
        <DepartmentFilter
          value={department}
          departments={departments}
          onChange={setDepartment}
        />
      </div>

      <div
        className={
          selectedEmployee
            ? 'employee-directory__body employee-directory__body--split'
            : 'employee-directory__body'
        }
      >
        {visibleEmployees.length > 0 ? (
          <EmployeeList
            employees={visibleEmployees}
            selectedId={selectedEmployee ? selectedEmployee.id : null}
            onSelect={handleSelect}
          />
        ) : (
          <p className="employee-directory__empty">No employees match</p>
        )}
        {selectedEmployee && (
          <EmployeeDetails employee={selectedEmployee} onClose={handleClose} />
        )}
      </div>
    </div>
  )
}

export default EmployeeDirectory
