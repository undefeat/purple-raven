export function isMobile() {
	const userAgent = navigator.userAgent || navigator.vendor;
	return /Android|iPad|iPhone|iPod/i.test(userAgent) ;
}

export function generateRandomString(length: number) {
	const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let str = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.round(Math.random() * (CHARS.length - 1));
		str += CHARS[randomIndex];
	}
	return str;
}