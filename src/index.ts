export interface Env {
	WEBHOOK_URL: string;
}

type WorkerRequestSanitizedData = {
	userId: string;
	email: string;
	entryCreated: string;
	request: string;
};

function sanitizedValues(values: { [key: string]: string }): WorkerRequestSanitizedData {
	return {
		userId: values['What is your user id?'],
		email: values['Email Address'],
		entryCreated: values['Timestamp'],
		request: values['What is your request?']
	};
}

function createCard(formData: WorkerRequestSanitizedData) {
	return {
		cardsV2: [
			{
				cardId: 'workerLimitRequest',
				card: {
					header: {
						title: `${formData.email}`,
						subtitle: `${formData.userId}`,
						imageUrl: 'https://developers.google.com/chat/images/quickstart-app-avatar.png',
						imageType: 'CIRCLE',
						imageAltText: 'Worker Limit Request Bot',
					},
					sections: [
						{
							header: 'Request Info',
							collapsible: false,
							uncollapsibleWidgetsCount: 1,
							widgets: [
								{
									decoratedText: {
										topLabel: 'Request:',
										text: `${formData.request}`,
									},
								},
							],
						},
					],
				},
			},
		],
	};
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const reqBody: { [key: string]: string } = await request.json();
			const formData = sanitizedValues(reqBody);

			const options: RequestInit = {
				method: 'post',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(createCard(formData)),
			};

			await fetch(env.WEBHOOK_URL, options);

			return new Response(`OK`);
		} catch (error) {
			console.error(error);

			return new Response('Error');
		}
	},
};
