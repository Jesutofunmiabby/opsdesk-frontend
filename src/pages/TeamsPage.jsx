import { useState } from 'react'
import employees from '../data/employees'
import EmployeeList from '../components/EmployeeList'
import EmployeeDetails from '../components/EmployeeDetails'
import SearchBox from '../components/SearchBox'
import DepartmentFilter from '../components/DepartmentFilter'
import {
  ALL_DEPARTMENTS,
  getDepartments,
  filterEmployees,
} from '../utils/employees'
import './TeamsPage.css'

// Computed once outside the component: the data never changes.
const departments = getDepartments(employees)

function TeamsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [nameQuery, setNameQuery] = useState('')
  const [department, setDepartment] = useState(ALL_DEPARTMENTS)

  // Derived from state during render, not stored in state of its own.
  const visibleEmployees = filterEmployees(employees, nameQuery, department)

  function handleSelect(employee) {
    setSelectedEmployee(employee)
  }

  function handleClose() {
    setSelectedEmployee(null)
  }

  return (
    <section>
      <h2 className="page-title">Employee directory</h2>

      <div className="teams-page__controls">
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
            ? 'teams-page__body teams-page__body--split'
            : 'teams-page__body'
        }
      >
        {visibleEmployees.length > 0 ? (
          <EmployeeList
            employees={visibleEmployees}
            selectedId={selectedEmployee ? selectedEmployee.id : null}
            onSelect={handleSelect}
          />
        ) : (
          <p className="teams-page__empty">No employees match</p>
        )}
        {selectedEmployee && (
          <EmployeeDetails employee={selectedEmployee} onClose={handleClose} />
        )}
      </div>
    </section>
  )
}

export default TeamsPage
