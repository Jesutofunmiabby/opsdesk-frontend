// One user from the dummyjson.com users API. The API sends many more fields;
// only the ones the app uses are listed here.
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  company: {
    name: string
    // The person's job title at the company.
    title: string
  }
}

// The shape of the API's answer: the list is inside a users field.
export interface UsersResponse {
  users: User[]
}
