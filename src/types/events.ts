export interface Event {
  id: number; // event id 
  title: string; // event title
  body: string; // brief description of the event
  timeing: string; // time of the event
  venue: string; // venue of the event
  coordinator: [string]; // coordinators
  contact_coordinator: [string]; // contact of coordinators
}

export const events: Event[] = [
  { id: 1, title: "UI/UX", body: "Learn to design a website", timeing: "10:00 AM", venue: "Online", coordinator: ["John Doe"], contact_coordinator: ["1234567890"] },
  { id: 2, title: "Android", body: "Learn to develop an android app", timeing: "10:00 AM", venue: "Online", coordinator: ["John Doe"], contact_coordinator: ["1234567890"] },
]
