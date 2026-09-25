import { useState } from 'react'
import employees from './data/employees'
import EmployeeList from './components/EmployeeList'
import EmployeeDetails from './components/EmployeeDetails'
import SearchBox from './components/SearchBox'
import './App.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [nameQuery, setNameQuery] = useState('')

  // Derived from state during render, not stored in state of its own.
  const query = nameQuery.trim().toLowerCase()
  const visibleEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(query),
  )

  function handleSelect(employee) {
    setSelectedEmployee(employee)
  }

  function handleClose() {
    setSelectedEmployee(null)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">OpsDesk</h1>
        <p className="app__subtitle">Employee directory</p>
      </header>

      <div className="app__controls">
        <SearchBox value={nameQuery} onChange={setNameQuery} />
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
          <EmployeeDetails employee={selectedEmployee} onClose={handleClose} />
        )}
      </main>
    </div>
  )
}

export default App
