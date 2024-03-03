export const sendEmail = async (
	toName: string,
	toEmail: string,
	subject: string,
	body: string,
) => {
	if (process.env.NODE_ENV !== "production") {
		console.log("Email sent in development mode");
		console.log(
			`To: ${toName} <${toEmail}>\nFrom: TechFiesta Team <${process.env.EMAIL}>\nSubject: ${subject}\nBody: ${body}`,
		);
		return "Email sent successfully!";
	}

	const hermesUrl = process.env.HERMES_URL;
	const hermesApiKey = process.env.HERMES_API_KEY;
	const email = process.env.EMAIL;

	if (!hermesUrl || !hermesApiKey || !email) {
		throw new Error("Email not configured");
	}

	// Change
	const emailData = {
		from: {
			name: "TechFiesta Team",
			email: email,
		},
		to: {
			name: toName,
			email: toEmail,
		},
		subject,
		body,
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
