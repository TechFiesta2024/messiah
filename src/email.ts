export const sendEmail = async (
	toName: string,
	toEmail: string,
	subject: string,
	body: string,
) => {
	await fetch("from the env", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": "from	env",
		},
		body: JSON.stringify({
			from: {
				name: "TechFiesta24 Tech Team",
				email: "env",
			},
			to: {
				name: toName,
				email: toEmail,
			},
			subject,
			body,
		}),
	});
	return "email";
};
