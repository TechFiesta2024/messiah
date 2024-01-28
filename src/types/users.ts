export interface Users {
  id: string; // user id, uuid
  name: string; // name
  email: string; // email
  college_name: string; // college name
  semester: number; // semester
  contact: string; // contact number
  workshops: [number]; // corresponding workshop id
  events: [number]; // corresponding event id
}
