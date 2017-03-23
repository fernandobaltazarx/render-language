define('webrtc-translate/controllers/room', ['exports', 'ember', 'webrtc-translate/models/message', 'webrtc-translate/config/environment'], function (exports, _ember, _webrtcTranslateModelsMessage, _webrtcTranslateConfigEnvironment) {

    var inject = _ember['default'].inject;
    var alias = _ember['default'].computed.alias;

    exports['default'] = _ember['default'].Controller.extend({
        isRemoteVideo: false,
        isDataChannelOpened: false,
        speechMessage: _webrtcTranslateModelsMessage['default'].create(),
        chatMessage: _webrtcTranslateModelsMessage['default'].create(),

        tour: inject.service('tour'),

        recognition: inject.service('speech-recognition'),
        isSpeechRecognitionActive: alias('recognition.isActive'),

        localSpeechLanguage: 'en-GB',
        localTranslationLanguage: _ember['default'].computed('localSpeechLanguage', function () {
            return this.get('localSpeechLanguage').split('-')[0];
        }),
        localSpeechLanguageChanged: _ember['default'].observer('localSpeechLanguage', function () {
            var language = this.get('localSpeechLanguage');

            this.sendLanguage(language);
            this.set('recognition.language', language);
        }),

        remoteSpeechLanguage: 'de-DE',
        remoteTranslationLanguage: _ember['default'].computed('remoteSpeechLanguage', function () {
            return this.get('remoteSpeechLanguage').split('-')[0];
        }),

        roomId: null,
        roomIdChanged: _ember['default'].observer('roomId', function () {
            console.log('Room ID: ', this.get('roomId'));

            if (this.get('roomId')) {
                this.setup();
            }
        }),

        // TODO: Cleanup init and setup methods
        init: function init() {
            this._super();

            var controller = this;

            // Initialize WebRTC
            var webrtc = new window.SimpleWebRTC({
                enableDataChannels: true,
                url: 'https://render-language.herokuapp.com:443',
                debug: false
            });

            webrtc.webrtc.on('localStream', function (stream) {
                console.log('localStream: ', stream);
                controller.set('localMediaStream', stream);
            });

            webrtc.webrtc.on('localStreamStopped', function () {
                console.log('localStreamStopped');
                controller.set('localMediaStream', null);
            });

            webrtc.config.localVideoEl = "local-video";
            webrtc.config.remoteVideosEl = "remote-video";

            webrtc.startLocalVideo();

            if (!window.localStorage.getItem('show-tour')) {
                webrtc.on('readyToCall', function () {
                    window.localStorage.setItem('show-tour', 'nope');
                    controller.get('tour').start();
                });
            }

            this.set('webrtc', webrtc);
        },

        setup: function setup() {
            var _arguments = arguments;

            var controller = this;
            var webrtc = this.get('webrtc');
            var recognition = this.get('recognition');

            recognition.on('result', function (event) {
                var interimTranscript = '';
                var finalTranscript = '';
                var messages = controller.get('messages');
                var message = controller.get('speechMessage');

                // TODO figure out a better way to add this message just once
                if (!messages.contains(message)) {
                    messages.pushObject(message);
                }

                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    var result = event.results[i];

                    if (result.isFinal) {
                        finalTranscript = result[0].transcript;
                        console.log("Final: ", finalTranscript);
                        break;
                    } else {
                        interimTranscript += result[0].transcript;
                        console.log("Interim: ", interimTranscript);
                    }
                }

                message.set('originalContent', interimTranscript);

                if (finalTranscript) {
                    message.setProperties({
                        originalContent: finalTranscript,
                        isFinal: true
                    });
                }

                if (message.get('isFinal')) {
                    controller.handleUntranslatedMessage(message)['finally'](function () {
                        finalTranscript = '';
                        controller.set('speechMessage', _webrtcTranslateModelsMessage['default'].create());
                    });
                }

                console.log(event.results);
            });

            webrtc.on('readyToCall', function () {
                webrtc.joinRoom(controller.get('roomId'));
            });

            webrtc.on('joinedRoom', function () {});

            webrtc.on('error', function (error) {
                switch (error) {
                    case 'full':
                        console.warn('You can\'t join this room, because it\'s full.');
                        break;
                    default:
                        console.warn(error);
                }
            });

            webrtc.on('videoAdded', function () {
                controller.set('isRemoteVideo', true);
            });

            webrtc.on('videoRemoved', function () {
                controller.set('isRemoteVideo', false);
            });

            webrtc.on('channelOpen', function (channel) {
                // Data channel with label 'simplewebrtc' is opened by SimpleWebRTC by default
                if (channel.label === 'simplewebrtc') {
                    controller.set('isDataChannelOpened', true);
                    console.info('Data channel opened.', _arguments);

                    // Send local speech language to the other peer
                    controller.sendLanguage(controller.get('localSpeechLanguage'));
                }
            });

            webrtc.on('channelClose', function (channel) {
                if (channel.label === 'simplewebrtc') {
                    controller.set('isDataChannelOpened', false);
                    console.info('Data channel closed.', _arguments);
                }
            });

            webrtc.on('channelError', function (channel) {
                if (channel.label === 'simplewebrtc') {
                    controller.set('isDataChannelOpened', false);
                    console.info('Data channel error.', _arguments);
                }
            });

            webrtc.on('channelMessage', function (peer, channelName, data) {
                if (channelName === 'simplewebrtc') {
                    var payload = data.payload;

                    switch (data.type) {
                        case 'message':
                            payload.isRemote = true;
                            payload.ifFinal = true;

                            var message = _webrtcTranslateModelsMessage['default'].create(payload);
                            controller.get('messages').pushObject(message);

                            controller.say({
                                text: message.get('translatedContent'),
                                lang: controller.get('localSpeechLanguage')
                            });
                            break;

                        case 'language':
                            controller.set('remoteSpeechLanguage', payload.language);
                            break;
                    }

                    console.log('Got message: ', data);
                }
            });
        },

        handleUntranslatedMessage: function handleUntranslatedMessage(message) {
            var _this = this;

            var promise = null;

            if (this.get('isDataChannelOpened')) {
                promise = this.translate({
                    source: this.get('localTranslationLanguage'),
                    target: this.get('remoteTranslationLanguage'),
                    q: message.get('formattedOriginalContent')
                }).then(function (data) {
                    if (data.error) {
                        console.error(data.error.message);
                    } else {
                        var translation = data.data.translations[0].translatedText;
                        message.set('translatedContent', translation);
                        _this.sendMessage(message);
                    }

                    return message;
                });
            } else {
                promise = _ember['default'].RSVP.resolve(message);
            }

            return promise;
        },

        translate: function translate(options) {
            // Wrap jQuery promise in RSVP promise
            return new _ember['default'].RSVP.Promise(function (resolve, reject) {
                _ember['default'].$.getJSON('https://www.googleapis.com/language/translate/v2?callback=?', {
                    key: _webrtcTranslateConfigEnvironment['default'].GOOGLE_TRANSLATE_API_KEY,
                    source: options.source,
                    target: options.target,
                    q: options.q
                }).then(resolve, reject);
            });
        },

        say: function say(options) {
            var msg = new window.SpeechSynthesisUtterance();
            msg.lang = options.lang;
            msg.text = options.text;

            window.speechSynthesis.speak(msg);
        },

        sendMessage: function sendMessage(message) {
            var webrtc = this.get('webrtc');

            webrtc.sendDirectlyToAll('simplewebrtc', 'message', {
                originalContent: message.get('formattedOriginalContent'),
                translatedContent: message.get('translatedContent')
            });
        },

        sendLanguage: function sendLanguage(language) {
            var webrtc = this.get('webrtc');

            webrtc.sendDirectlyToAll('simplewebrtc', 'language', {
                language: language
            });
        },

        actions: {
            handleChatMessage: function handleChatMessage() {
                var _this2 = this;

                var message = this.get('chatMessage');

                if (message.originalContent) {
                    message.set('isFinal', true);
                    this.get('messages').pushObject(message);

                    this.handleUntranslatedMessage(message).then(function () {
                        _this2.set('chatMessage', _webrtcTranslateModelsMessage['default'].create());
                    });
                }
            }
        }
    });
});