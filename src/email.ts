export const sendEmail = async (
	toName: string,
	toEmail: string,
	subject: string,
	email_body: string,
) => {
	if (process.env.NODE_ENV !== "production") {
		console.log("Email sent in development mode");
		console.log(
			`To: ${toName} <${toEmail}>\nFrom: TechFiesta Team <${process.env.EMAIL}>\nSubject: ${subject}`,
		);
		return "Email sent successfully!";
	}

	const hermesUrl = process.env.HERMES_URL;
	const hermesApiKey = process.env.HERMES_API_KEY;

	if (!hermesUrl || !hermesApiKey) {
		throw new Error("Email not configured");
	}

	// Change
	const emailData = {
		name: toName,
		email: toEmail,
		subject,
		email_body,
	};

	try {
		const response = await fetch(`${hermesUrl}/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": hermesApiKey,
			},
			body: JSON.stringify(emailData),
		});
		if (!response.ok) {
			throw new Error(`Email not sent. Rest API error: ${response.body}`);
		}
		return "Email sent successfully!";
	} catch (error) {
		throw new Error(`Hermes Error. Error: ${error}`);
	}
};
