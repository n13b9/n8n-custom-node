import {
	type IExecuteFunctions,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestMethods,
} from 'n8n-workflow';

import {
	supadataApiRequest,
	extractVideoIdFromUrl,
	extractChannelIdFromUrl,
} from './GenericFunctions';

export class Supadata implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Supadata',
		name: 'supadata',
		icon: 'file:Supadata.svg',
		group: ['input'],
		version: 1,
		description: 'Access Supadata API to fetch YouTube and web data',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Supadata',
		},
		// usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'supadataApi',
				required: true,
			},
		],
		properties: [
			// ----------------------------------------------------------------
			//         Resource to Operate on
			// ----------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Web Scrape', value: 'webScrape' },
					{ name: 'YouTube Channel', value: 'youtubeChannel' },
					{ name: 'YouTube Channel Video', value: 'youtubeChannelVideo' },
					{ name: 'YouTube Transcript', value: 'youtubeTranscript' },
					{ name: 'YouTube Video', value: 'youtubeVideo' },
				],
				default: 'youtubeVideo',
			},

			// --------------------------------------------------------------------------------------------------------
			//         YouTube Video Operations
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['youtubeVideo'],
					},
				},
				options: [
					{
						name: 'Get Video',
						value: 'getVideo',
						description: 'Get details of a youTube video',
						action: 'Get youtube video details',
					},
				],
				default: 'getVideo',
			},
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				options: [
					{
						name: 'Video ID',
						value: 'videoId',
					},
					{
						name: 'Video URL',
						value: 'videoUrl',
					},
				],
				default: 'videoId',
				displayOptions: {
					show: {
						resource: ['youtubeVideo'],
						operation: ['getVideo'],
					},
				},
			},
			{
				displayName: 'Video ID',
				name: 'videoId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeVideo'],
						operation: ['getVideo'],
						inputType: ['videoId'],
					},
				},
				placeholder: 'dQw4w9WgXcQ',
				description: 'The ID of the YouTube video',
			},
			{
				displayName: 'Video URL',
				name: 'videoUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeVideo'],
						operation: ['getVideo'],
						inputType: ['videoUrl'],
					},
				},
				placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				description: 'The URL of the YouTube video',
			},

			// --------------------------------------------------------------------------------------------------------
			//         YouTube Transcript Operations
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['youtubeTranscript'],
					},
				},
				options: [
					{
						name: 'Get Transcript',
						value: 'getTranscript',
						description: 'Get the transcript of a YouTube video',
						action: 'Get youtube video transcript',
					},
				],
				default: 'getTranscript',
			},
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				options: [
					{
						name: 'Video ID',
						value: 'videoId',
					},
					{
						name: 'Video URL',
						value: 'videoUrl',
					},
				],
				default: 'videoId',
				displayOptions: {
					show: {
						resource: ['youtubeTranscript'],
						operation: ['getTranscript'],
					},
				},
			},
			{
				displayName: 'Video ID',
				name: 'videoId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeTranscript'],
						operation: ['getTranscript'],
						inputType: ['videoId'],
					},
				},
				placeholder: 'dQw4w9WgXcQ',
				description: 'The ID of the YouTube video',
			},
			{
				displayName: 'Video URL',
				name: 'videoUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeTranscript'],
						operation: ['getTranscript'],
						inputType: ['videoUrl'],
					},
				},
				placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				description: 'The URL of the YouTube video',
			},
			{
				displayName: 'Return as Plain Text',
				name: 'text',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['youtubeTranscript'],
						operation: ['getTranscript'],
					},
				},
				description: 'Whether to return the transcript as plain text',
			},

			// --------------------------------------------------------------------------------------------------------
			//         YouTube Channel Operations
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['youtubeChannel'],
					},
				},
				options: [
					{
						name: 'Get Channel',
						value: 'getChannel',
						description: 'Get details of a YouTube channel',
						action: 'Get youtube channel details',
					},
				],
				default: 'getChannel',
			},
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				options: [
					{
						name: 'Channel ID',
						value: 'channelId',
					},
					{
						name: 'Channel URL',
						value: 'channelUrl',
					},
				],
				default: 'channelId',
				displayOptions: {
					show: {
						resource: ['youtubeChannel'],
						operation: ['getChannel'],
					},
				},
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeChannel'],
						operation: ['getChannel'],
						inputType: ['channelId'],
					},
				},
				placeholder: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
				description: 'The ID of the YouTube channel',
			},
			{
				displayName: 'Channel URL',
				name: 'channelUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeChannel'],
						operation: ['getChannel'],
						inputType: ['channelUrl'],
					},
				},
				placeholder: 'https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw',
				description: 'The URL of the YouTube channel',
			},

			// --------------------------------------------------------------------------------------------------------
			//         YouTube Channel Videos Operations
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['youtubeChannelVideo'],
					},
				},
				options: [
					{
						name: 'Get Channel Videos',
						value: 'getChannelVideos',
						description: 'Get videos of a YouTube channel',
						action: 'Get youtube channel videos',
					},
				],
				default: 'getChannelVideos',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtubeChannelVideo'],
						operation: ['getChannelVideos'],
					},
				},
				placeholder: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
				description: 'The ID of the YouTube channel',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['youtubeChannelVideo'],
						operation: ['getChannelVideos'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				displayOptions: {
					show: {
						resource: ['youtubeChannelVideo'],
						operation: ['getChannelVideos'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},

			// --------------------------------------------------------------------------------------------------------
			//         Web Scrape Operations
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webScrape'],
					},
				},
				options: [
					{
						name: 'Scrape URL',
						value: 'scrapeUrl',
						description: 'Scrape data from a URL',
						action: 'Scrape data from a URL',
					},
				],
				default: 'scrapeUrl',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['webScrape'],
						operation: ['scrapeUrl'],
					},
				},
				placeholder: 'https://example.com',
				description: 'The URL to scrape',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i);
				const operation = this.getNodeParameter('operation', i);
				let responseData;

				if (resource === 'youtubeVideo') {
					// Get YouTube Video
					if (operation === 'getVideo') {
						const inputType = this.getNodeParameter('inputType', i) as string;
						const videoIdentifier =
							inputType === 'videoId'
								? (this.getNodeParameter('videoId', i) as string)
								: extractVideoIdFromUrl(
										this.getNodeParameter('videoUrl', i) as string,
										this.getNode(),
									);

						responseData = await supadataApiRequest.call(
							this,
							'GET' as IHttpRequestMethods,
							'/youtube/video',
							{},
							{ id: videoIdentifier },
						);
					}
				} else if (resource === 'youtubeTranscript') {
					// Get YouTube Transcript
					if (operation === 'getTranscript') {
						const inputType = this.getNodeParameter('inputType', i) as string;
						const videoIdentifier =
							inputType === 'videoId'
								? (this.getNodeParameter('videoId', i) as string)
								: extractVideoIdFromUrl(
										this.getNodeParameter('videoUrl', i) as string,
										this.getNode(),
									);
						const text = this.getNodeParameter('text', i) as boolean;

						responseData = await supadataApiRequest.call(
							this,
							'GET' as IHttpRequestMethods,
							'/youtube/transcript',
							{},
							{ id: videoIdentifier, text },
						);
					}
				} else if (resource === 'youtubeChannel') {
					// Get YouTube Channel
					if (operation === 'getChannel') {
						const inputType = this.getNodeParameter('inputType', i) as string;
						const channelIdentifier =
							inputType === 'channelId'
								? (this.getNodeParameter('channelId', i) as string)
								: extractChannelIdFromUrl(
										this.getNodeParameter('channelUrl', i) as string,
										this.getNode(),
									);

						responseData = await supadataApiRequest.call(
							this,
							'GET' as IHttpRequestMethods,
							'/youtube/channel',
							{},
							{ id: channelIdentifier },
						);
					}
				} else if (resource === 'youtubeChannelVideo') {
					// Get YouTube Channel Videos
					if (operation === 'getChannelVideos') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const qs: IDataObject = { id: channelId };

						if (!returnAll) {
							qs.limit = this.getNodeParameter('limit', i);
						}

						responseData = await supadataApiRequest.call(
							this,
							'GET' as IHttpRequestMethods,
							'/youtube/channel/videos',
							{},
							qs,
						);
						responseData = responseData.videoIds;
					}
				} else if (resource === 'webScrape') {
					// Scrape URL
					if (operation === 'scrapeUrl') {
						const url = this.getNodeParameter('url', i) as string;
						responseData = await supadataApiRequest.call(
							this,
							'GET' as IHttpRequestMethods,
							'/web/scrape',
							{},
							{ url },
						);
					}
				}

				// Prepare output
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
