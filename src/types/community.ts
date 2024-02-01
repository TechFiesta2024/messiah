import { z } from "zod";

export const CommunitySchema = z.object({
	id: z.string(),
	created_at: z.string(),
	name: z.string(),
	email: z.string().email(),
	college: z.string(),
	contact: z.string().min(10).max(10),
	socials: z.array(z.string().url()),
});
