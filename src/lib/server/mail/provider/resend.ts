import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import assert from 'node:assert';
import type { MailData, MailProvider } from './types';

const mail = (resend: Resend) => {
	return async (data: MailData) => {
		try {
			const { error } = await resend.emails.send({
				from: data.from,
				to: data.to,
				subject: data.subject,
				html: data.html
			});

			if (error) {
				throw new Error(`Error on sending mail with Resend: ${JSON.stringify(error)}`);
			}
		} catch (error) {
			throw new Error(`Error on sending mail with Resend: ${error}`);
		}
	};
};

export const initResend = (): MailProvider => {
	assert(env.RESEND_API_KEY, 'RESEND_API_KEY is required');

	const resend = new Resend(env.RESEND_API_KEY);

	return {
		mail: mail(resend)
	};
};
