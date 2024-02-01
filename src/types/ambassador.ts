import { z } from "zod";

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
