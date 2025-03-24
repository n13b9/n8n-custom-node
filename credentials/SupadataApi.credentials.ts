import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SupadataApi implements ICredentialType {
	name = 'supadataApi';
	displayName = 'Supadata API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://supadata.ai/documentation/getting-started';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'Enter your Supadata API Key',
			required: true,
		},
	];
	authenticate = {
		type: 'generic',
		properties: {
			qs: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	} as const;
}

module.exports = { SupadataApi };
