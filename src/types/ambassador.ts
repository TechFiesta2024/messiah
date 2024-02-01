import { z } from "zod";

export interface Ambassador {
	id: string; // user id, uuid
	name: string; // name
	email: string; // email
	college: string; // college name
	contact: string; // contact number
	linkedin: string; // linkedin link
	twitter: string; // twitter link
	created_at: string; // created at
	description: string; // description
	no_of_regs: number; // number of responses
	referral_code: string; // referral code
}

export const AmbassadorSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	college: z.string(),
	contact: z.string().min(10).max(10),
	linkedin: z.string().url(),
	twitter: z.string().url(),
	created_at: z.string(),
	description: z.string(),
	no_of_regs: z.number(),
	referral_code: z.string(),
});
