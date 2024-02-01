export const generateRandomString = (length: number): string => {
	const chars =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charsLength = chars.length;

	const buffer = new Uint8Array(length);

	crypto.getRandomValues(buffer);

	const result = Array.from(buffer, (byte) => chars[byte % charsLength]).join(
		"",
	);

	return result;
};
