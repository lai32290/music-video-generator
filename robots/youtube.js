const fs = require('fs');
const express = require('express');
const google = require('googleapis').google;
const youtube = google.youtube({ version: 'v3' });
const { finalResultVideo } = require('../variables.js');
const OAuth2 = google.auth.OAuth2;

async function robot(context) {
    const { videos, videosDuration } = context;
    await authenticateOAuth();
    await updateVideo();
    await updateDescription();

    async function authenticateOAuth() {
        const webServer = await startWebServer();
        const OAuthClient = await createOAuthClient();
        requestUserConsent(OAuthClient);
        const authToken = await waitForGoogleCallback(webServer);
        await requestAccessTokens(OAuthClient, authToken);
        setGlobalGoogleAuthentication(OAuthClient);
        await stopWebServer(webServer);

        async function startWebServer() {
            const port = 5000;
            return new Promise((resolve, reject) => {
                const app = express();
                const server = app.listen(port, () => {
                    console.log('Server is on port 5000');
                    resolve({
                        app,
                        server
                    });
                });
            });
        }

        async function createOAuthClient() {
            const credentials = require('../credentials/video-generator-oauth.json');

            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            );

            return OAuthClient;
        }

        function requestUserConsent(OAuthClient) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            });

            console.log(`Please give your consent: ${consentUrl}`);
        }

        async function waitForGoogleCallback(webServer) {
            return new Promise((resolve, reject) => {
                console.log('Waiting for user consent...');
                webServer.app.get('/oauth-callback', (req, res) => {
                    const authToken = req.query.code;
                    console.log(`Consent given: ${authToken}`);
                    res.send('<h1>Thank you!</h1>Now you can close this page.');
                    resolve(authToken);
                });
            });
        }

        async function requestAccessTokens(OAuthClient, authToken) {
            return new Promise((resolve, reject) => {
                OAuthClient.getToken(authToken, (error, tokens) => {
                    if(error) reject(error);

                    console.log('Access token received.');

                    OAuthClient.setCredentials(tokens);
                    resolve();
                });
            });
        }

        function setGlobalGoogleAuthentication(OAuthClient) {
            google.options({
                auth: OAuthClient
            });
        }

        async function stopWebServer(webServer) {
            return new Promise(resolve => {
                webServer.server.close(resolve);
            });
        }
    }

	async function updateVideo() {
		const videoFilePath = finalResultVideo;
		const videoFileSize = fs.statSync(videoFilePath).size;
		const videoTitle = 'Generated - Test';
		const videoDescription = '';

		const requestParams = {
			part: 'snippet, status',
			requestBody: {
				snippet: {
					title: videoTitle,
					description: videoDescription
				},
				status: {
					privacyStatus: 'unlisted'
				}
			},
			media: {
				body: fs.createReadStream(videoFilePath)
			}
		};

		const youtubeResponse = await youtube.videos.insert(requestParams, {
			onUploadProgress
		});

        context.videoUrl = `https://youtu.be/${youtubeResponse.data.id}`;
        context.videoId = youtubeResponse.data.id;
		console.log(`Video uploaded on URL: ${context.videoUrl}`);

		return youtubeResponse.data;

		function onUploadProgress(event) {
			const progress = Math.round(event.bytesRead / videoFileSize * 100);

			console.log(`${progress}% uploaded`);
		}
	}

    async function updateDescription() {
        const { videoUrl, videoId } = context;
        let startTime = 0;
		const videoTitle = 'Generated - Test';
        const videoDescription = context.videosDuration.map(duration => {
            const link = `<a href="${videoUrl}?t=${startTime}">${duration.name}</a>`;
            startTime += duration.duration;
            return link;
        }).join('\n');
        const requestParams = {
            part: 'snippet',
            resource: {
                id: videoId,
                snippet: {
                    categoryId: 22,
                    title: videoTitle,
                    description: videoDescription
                }
            }
        };

        const youtubeResponse = await youtube.videos.update(requestParams);
        console.log('Video description updated');
    }
}

module.exports = robot;
