// The department filter value that means "do not filter by department".
export const ALL_DEPARTMENTS = 'all'

// Department options taken from the data itself, so a new department in
// employees.js appears in the dropdown with no change here.
export function getDepartments(employees) {
  return [...new Set(employees.map((employee) => employee.department))].sort()
}

// Name matching is case-insensitive and ignores surrounding whitespace. Both
// conditions are applied in one pass, so search and department narrow the
// list together.
export function filterEmployees(employees, nameQuery, department) {
  const query = nameQuery.trim().toLowerCase()
  return employees.filter((employee) => {
    const matchesName = employee.name.toLowerCase().includes(query)
    const matchesDepartment =
      department === ALL_DEPARTMENTS || employee.department === department
    return matchesName && matchesDepartment
  })
}
