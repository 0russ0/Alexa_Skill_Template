const Alexa = require('ask-sdk-core');

const soundURL = 'https://streaming.live365.com/a22325';
const metadata = {
    "title": "Home Team FM",
    "subtitle": "Home Team FM Live Stream",
    "art": {
        "sources": [
            {
                "url": "https://cdn.voiceapps.com/1615979128399-762ce8de-2b47-1175-2426d47813f0.jpg",
                "widthPixels": 512,
                "heightPixels": 512
            }
        ]
    },
    "backgroundImage": {
        "sources": [
            {
                "url": "https://cdn.voiceapps.com/1615979130472-1b266b38-5808-b55a-7a777f43bc08.jpg",
                "widthPixels": 1200,
                "heightPixels": 800
            }
        ]
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        return AudioIntentHandler.handle(handlerInput);
    }
};

const AudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayStream';
    },
    async handle(handlerInput) {
        let expectedPreviousToken = 'token' + Math.random();

        let speakOutput = `Now playing Home Team dot f m`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective('REPLACE_ALL', soundURL, expectedPreviousToken, 0, null, metadata)
            .getResponse();
    }
};

const AudioPlayerEventHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('AudioPlayer.');
    },
    async handle(handlerInput) {
        const request = Alexa.getRequestType(handlerInput.requestEnvelope);

        switch (request) {
            case 'AudioPlayer.PlaybackStarted':
                return handlerInput.responseBuilder
                    .getResponse();

            case 'AudioPlayer.PlaybackFinished':
                return handlerInput.responseBuilder
                    .getResponse();

            case 'AudioPlayer.PlaybackStopped':
                return handlerInput.responseBuilder
                    .getResponse();

            case 'AudioPlayer.PlaybackNearlyFinished':
                let expectedPreviousToken = 'token' + Math.random();

                return handlerInput.responseBuilder
                    .addAudioPlayerPlayDirective('REPLACE_ALL', soundURL, expectedPreviousToken, 0, null, metadata)
                    .getResponse();

            case 'AudioPlayer.PlaybackFailed':
                console.log('Playback Failed');
                break;
        }

        return handlerInput.responseBuilder
            .getResponse();
    }
};

const PausePlaybackHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent') 
            || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'PlaybackController.PauseCommandIssued');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(`Thanks for playing.`)
            .addAudioPlayerStopDirective()
            .getResponse();
    }
}

const ResumePlaybackHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent') 
            || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'PlaybackController.PlayCommandIssued');
    },
    handle(handlerInput) {
        let expectedPreviousToken = 'token' + Math.random();

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', soundURL, expectedPreviousToken, 0, null, metadata)
            .getResponse();
    }
}

const AudioControlPlaybackHandler = {
	async canHandle(handlerInput) {
	  const request = handlerInput.requestEnvelope.request;
  
	  return request.type === 'PlaybackController.NextCommandIssued' || request.type === 'PlaybackController.PreviousCommandIssued' ||
		  (request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.NextIntent' || request.intent.name === 'AMAZON.PreviousIntent' || request.intent.name === 'AMAZON.LoopOnIntent' || request.intent.name === 'AMAZON.LoopOffIntent' || request.intent.name === 'AMAZON.ShuffleOnIntent' || request.intent.name === 'AMAZON.ShuffleOffIntent' || request.intent.name === 'AMAZON.StartOverIntent'));
	},
	handle(handlerInput) {
		const speechText = `Sorry I can't do that yet.`;
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	},
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        let expectedPreviousToken = 'token' + Math.random();

        let speakOutput = `This skill plays the live stream of ${metadata.title}. Playing great music from Home Team dot fm.`;


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .addAudioPlayerPlayDirective('REPLACE_ALL', soundURL, expectedPreviousToken, 0, null, metadata)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = `Thanks for playing.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AudioIntentHandler,
        AudioPlayerEventHandler,
        PausePlaybackHandler,
        ResumePlaybackHandler,
        AudioControlPlaybackHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
