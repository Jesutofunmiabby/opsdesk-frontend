import { useState } from 'react'
import employees from './data/employees'
import EmployeeList from './components/EmployeeList'
import EmployeeDetails from './components/EmployeeDetails'
import './App.css'

function App() {
  // Search and the department filter are the remaining items on issue #1.
  const [selectedEmployee, setSelectedEmployee] = useState(null)

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
      <main className={selectedEmployee ? 'app__body app__body--split' : 'app__body'}>
        <EmployeeList
          employees={employees}
          selectedId={selectedEmployee ? selectedEmployee.id : null}
          onSelect={handleSelect}
        />
        {selectedEmployee && (
          <EmployeeDetails employee={selectedEmployee} onClose={handleClose} />
        )}
      </main>
    </div>
  )
}

export default App
