export interface Community {
	id: string; // user id, uuid
	name: string; // name
	email: string; // email
	college_name: string; // college name
	contact: string; // contact number
	no_of_regs: number; // number of responses
	socials: [string]; // social links
}
