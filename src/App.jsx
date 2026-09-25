import employees from './data/employees'
import EmployeeList from './components/EmployeeList'
import './App.css'

function App() {
  // Search, department filter and the details view are the remaining
  // checklist items on issue #1. For now a click just reports the employee.
  function handleSelect(employee) {
    console.log('Selected employee:', employee)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">OpsDesk</h1>
        <p className="app__subtitle">Employee directory</p>
      </header>
      <main>
        <EmployeeList employees={employees} onSelect={handleSelect} />
      </main>
    </div>
  )
}

export default App
