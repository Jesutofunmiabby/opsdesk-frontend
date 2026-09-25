import { useState } from 'react'
import employees from './data/employees'
import EmployeeList from './components/EmployeeList'
import EmployeeDetails from './components/EmployeeDetails'
import SearchBox from './components/SearchBox'
import DepartmentFilter from './components/DepartmentFilter'
import TicketBoard from './components/TicketBoard'
import UsersList from './components/UsersList'
import {
  ALL_DEPARTMENTS,
  getDepartments,
  filterEmployees,
} from './utils/employees'
import './App.css'

// Computed once outside the component: the data never changes.
const departments = getDepartments(employees)

function App() {
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
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <h1 className="app__title">OpsDesk</h1>
        </div>
      </header>

      <div className="app__content">
        <h2 className="app__section-title">Employee directory</h2>

        <div className="app__controls">
          <SearchBox value={nameQuery} onChange={setNameQuery} />
          <DepartmentFilter
            value={department}
            departments={departments}
            onChange={setDepartment}
          />
        </div>

        <main
          className={
            selectedEmployee ? 'app__body app__body--split' : 'app__body'
          }
        >
          {visibleEmployees.length > 0 ? (
            <EmployeeList
              employees={visibleEmployees}
              selectedId={selectedEmployee ? selectedEmployee.id : null}
              onSelect={handleSelect}
            />
          ) : (
            <p className="app__empty">No employees match</p>
          )}
          {selectedEmployee && (
            <EmployeeDetails
              employee={selectedEmployee}
              onClose={handleClose}
            />
          )}
        </main>

        <div className="app__section">
          <TicketBoard />
        </div>

        <div className="app__section">
          <h2 className="app__section-title">Users</h2>
          <UsersList />
        </div>
      </div>
    </div>
  )
}

export default App
