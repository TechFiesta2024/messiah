enum location {
  online,
  offline
}

export interface Workshop {
  id: number; // workshop id 
  title: string; // workshop title
  body: string; // description of the workshop
  timeing: string; // time of the workshop
  venu: location; // online or offline
  link: string; // meeting link for online workshop
  dest: string; // destination for offline workshop
  coordinator: [string]; // coordinators
  contact_coordinator: [string]; // contact of coordinators
}

export const workshops: Workshop[] = [
  { id: 1, title: "UI/UX", body: "Learn to design a website", timeing: "10:00 AM", venu: location.online, link: "https://meet.google.com/lookup/abcd", dest: "", coordinator: ["John Doe"], contact_coordinator: ["1234567890"] },
  { id: 2, title: "Android", body: "Learn to develop an android app", timeing: "10:00 AM", venu: location.online, link: "https://meet.google.com/lookup/abcd", dest: "", coordinator: ["John Doe"], contact_coordinator: ["1234567890"] },
];
