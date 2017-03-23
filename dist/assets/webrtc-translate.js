"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('webrtc-translate/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'webrtc-translate/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

    'use strict';

    var App;

    Ember['default'].MODEL_FACTORY_INJECTIONS = true;

    App = Ember['default'].Application.extend({
        modulePrefix: config['default'].modulePrefix,
        podModulePrefix: config['default'].podModulePrefix,
        Resolver: Resolver['default']
    });

    loadInitializers['default'](App, config['default'].modulePrefix);

    exports['default'] = App;

});
define('webrtc-translate/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'webrtc-translate/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('webrtc-translate/components/language-flag', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['flag'],
        classNameBindings: ['flagName'],

        flagName: Ember['default'].computed('language', function () {
            var language = this.get('language');

            if (language) {
                return language.split('-')[1].toUpperCase();
            }
        })
    });

});
define('webrtc-translate/components/language-select', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        content: null,
        selectedValue: null,

        didInitAttrs: function didInitAttrs() {
            this._super.apply(this, arguments);
            var content = this.get("content");

            if (!content) {
                this.set("content", []);
            }
        },

        actions: {
            change: function change() {
                var changeAction = this.get("action");
                var selectedEl = this.$("select")[0];
                var selectedIndex = selectedEl.selectedIndex;
                var content = this.get("content");
                var selectedValue = content[selectedIndex];

                this.set("selectedValue", selectedValue);
                changeAction(selectedValue);
            }
        }
    });

});
define('webrtc-translate/components/message-item', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['message'],
        classNameBindings: ['message.isRemote:remote:local']
    });

});
define('webrtc-translate/components/message-list', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['chat'],
        messages: [],

        scrollChatToBottom: Ember['default'].observer('messages.[]', function () {
            var element = this.$();

            // Wait till the view is updated
            if (element) {
                Ember['default'].run.schedule('afterRender', function () {
                    element.scrollTop(element.prop('scrollHeight'));
                });
            }
        })
    });

});
define('webrtc-translate/components/speech-volume-oscillator', ['exports', 'ember', 'webrtc-translate/models/volume-analyser'], function (exports, Ember, VolumeAnalyser) {

    'use strict';

    var alias = Ember['default'].computed.alias;

    // TODO: move volume calculations to a service
    exports['default'] = Ember['default'].Component.extend({
        isVisible: alias('isSpeechRecognitionActive'),

        init: function init() {
            this._super();

            this.setProperties({
                time: 0,
                wavelength: 6,
                speed: 2,
                volumeAnalyser: VolumeAnalyser['default'].create()
            });
        },

        onStreamChange: (function () {
            var stream = this.get('stream');
            this.get('volumeAnalyser').set('stream', stream);
        }).observes('stream'),

        draw: function draw() {
            var canvas = this.$('canvas').get(0);
            var ctx = canvas.getContext('2d');
            var speed = this.get('speed');
            var wavelength = this.get('wavelength');
            var time = this.get('time');
            var offset = canvas.height / 2;
            var volume = this.get('volumeAnalyser.volume');
            var amplitude = Math.max(volume / 2, 1.1);

            function f(x) {
                var xprime = x + speed * time;
                return Math.sin(xprime / wavelength) * amplitude + offset;
            }

            // Clear
            ctx.fillStyle = "rgb(15, 15 ,15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, f(0));
            for (var x = 1; x < canvas.width; x++) {
                ctx.lineTo(x, f(x));
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(68, 133, 247)";
            ctx.stroke();

            this.set('time', time + 0.7);

            var drawRAF = window.requestAnimationFrame(this.draw.bind(this));
            this.set('drawRAF', drawRAF);
        },

        onIsSpeechRecognitionActiveChange: (function () {
            var isActive = this.get('isSpeechRecognitionActive');
            return isActive ? this.start() : this.stop();
        }).observes('isSpeechRecognitionActive'),

        start: function start() {
            var drawRAF = window.requestAnimationFrame(this.draw.bind(this));
            this.set('drawRAF', drawRAF);
        },

        stop: function stop() {
            var drawRAF = this.get('drawRAF');

            if (drawRAF) {
                window.cancelAnimationFrame(drawRAF);
            }
        }
    });

});
define('webrtc-translate/components/start-speech-recognition-button', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var inject = Ember['default'].inject;
    var alias = Ember['default'].computed.alias;

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['speech-recognition-button'],

        recognition: inject.service('speech-recognition'),
        isSpeechRecognitionActive: alias('recognition.isActive'),

        flagName: (function () {
            return this.get('language').split('-')[1].toUpperCase();
        }).property('language'),

        // TODO: make flag a separate component and toggle its
        // 'isVisible' property instead.
        onIsSpeechRecognitionActiveChange: (function () {
            var isActive = this.get('isSpeechRecognitionActive');
            var startButton = this.$('.flag');

            return isActive ? startButton.hide() : startButton.show();
        }).observes('isSpeechRecognitionActive'),

        actions: {
            // TODO: Wait for local video to be on
            toggleRecognition: function toggleRecognition() {
                var recognition = this.get("recognition");

                if (this.get("isSpeechRecognitionActive")) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            }
        }
    });

});
define('webrtc-translate/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('webrtc-translate/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('webrtc-translate/controllers/room', ['exports', 'ember', 'webrtc-translate/models/message', 'webrtc-translate/config/environment'], function (exports, Ember, Message, config) {

    'use strict';

    var inject = Ember['default'].inject;
    var alias = Ember['default'].computed.alias;

    exports['default'] = Ember['default'].Controller.extend({
        isRemoteVideo: false,
        isDataChannelOpened: false,
        speechMessage: Message['default'].create(),
        chatMessage: Message['default'].create(),

        tour: inject.service('tour'),

        recognition: inject.service('speech-recognition'),
        isSpeechRecognitionActive: alias('recognition.isActive'),

        localSpeechLanguage: 'en-GB',
        localTranslationLanguage: Ember['default'].computed('localSpeechLanguage', function () {
            return this.get('localSpeechLanguage').split('-')[0];
        }),
        localSpeechLanguageChanged: Ember['default'].observer('localSpeechLanguage', function () {
            var language = this.get('localSpeechLanguage');

            this.sendLanguage(language);
            this.set('recognition.language', language);
        }),

        remoteSpeechLanguage: 'de-DE',
        remoteTranslationLanguage: Ember['default'].computed('remoteSpeechLanguage', function () {
            return this.get('remoteSpeechLanguage').split('-')[0];
        }),

        roomId: null,
        roomIdChanged: Ember['default'].observer('roomId', function () {
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
                url: 'https://webrtc-translate-signalmaster.herokuapp.com:443',
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
                        controller.set('speechMessage', Message['default'].create());
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

                            var message = Message['default'].create(payload);
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
                promise = Ember['default'].RSVP.resolve(message);
            }

            return promise;
        },

        translate: function translate(options) {
            // Wrap jQuery promise in RSVP promise
            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                Ember['default'].$.getJSON('https://www.googleapis.com/language/translate/v2?callback=?', {
                    key: config['default'].GOOGLE_TRANSLATE_API_KEY,
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
                        _this2.set('chatMessage', Message['default'].create());
                    });
                }
            }
        }
    });

});
define('webrtc-translate/helpers/is-equal', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

    exports['default'] = Ember['default'].Helper.helper(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var leftSide = _ref2[0];
        var rightSide = _ref2[1];

        return leftSide === rightSide;
    });

});
define('webrtc-translate/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'webrtc-translate/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('webrtc-translate/initializers/export-application-global', ['exports', 'ember', 'webrtc-translate/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('webrtc-translate/models/message', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Object.extend({
        originalContent: null,
        translatedContent: null,
        isFinal: false,
        isRemote: false,

        formattedOriginalContent: (function () {
            var content = this.get('originalContent'),
                isFinal = this.get('isFinal');

            return isFinal ? this.capitalize(content) : content;
        }).property('originalContent', 'ifFinal'),

        capitalize: function capitalize(string) {
            var first_char = /\S/;
            return string.replace(first_char, function (match) {
                return match.toUpperCase();
            });
        },

        linebreak: function linebreak(string) {
            var two_line = /\n\n/g;
            var one_line = /\n/g;

            return string.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }
    });

});
define('webrtc-translate/models/volume-analyser', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Object.extend({
        stream: null,

        onStreamChange: (function () {
            var stream = this.get('stream');

            if (stream) {
                var AudioContext = window.AudioContext || window.webkitAudioContext;
                var context = new AudioContext();
                var analyser = context.createAnalyser();
                analyser.fftSize = 128;

                // TODO check what these exactly do
                analyser.minDecibels = -90;
                analyser.maxDecibels = -10;
                analyser.smoothingTimeConstant = 0.85;

                var source = context.createMediaStreamSource(stream);
                source.connect(analyser);

                this.set('analyser', analyser);
                this.set('bufferLength', analyser.fftSize);
            } else {}
        }).observes('stream'),

        volume: (function () {
            var stream = this.get('stream');

            if (stream) {
                var analyser = this.get('analyser');
                var bufferLength = this.get('bufferLength');
                var dataArray = new Uint8Array(bufferLength);
                analyser.getByteTimeDomainData(dataArray);

                // Return volume in range 0..64
                var volume = Math.max.apply(null, dataArray) - 128;
                volume = Math.max(volume, 0);
                volume = Math.min(volume, 64);
                return volume;
            } else {
                return null;
            }
        }).property().volatile().readOnly()
    });

});
define('webrtc-translate/router', ['exports', 'ember', 'webrtc-translate/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('room', { path: '/rooms/:room_id' });
  });

  exports['default'] = Router;

});
define('webrtc-translate/routes/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        beforeModel: function beforeModel() {
            function uuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : r & 0x3 | 0x8;
                    return v.toString(16);
                });
            }

            this.transitionTo('room', uuid());
        }
    });

});
define('webrtc-translate/routes/room', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        beforeModel: function beforeModel() {
            var supports = {
                webRTC: !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection),
                webSpeech: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
                webAudio: !!window.AudioContext
            };

            if (!(supports.webRTC && supports.webSpeech && supports.webAudio)) {
                return Ember['default'].RSVP.reject();
            }
        },

        model: function model(params) {
            return {
                roomId: params.room_id,
                messages: []
            };
        },

        setupController: function setupController(controller, model) {
            controller.setProperties(model);
        }
    });

});
define('webrtc-translate/services/speech-recognition', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend(Ember['default'].Evented, {
        isActive: false,
        languages: ['en-GB', 'en-US', 'de-DE', 'es-ES', 'fr-FR', 'it-IT', 'hu-HU', 'nl-NL', 'pl-PL', 'pt-PT', 'sk-SK', 'sv-SE'],
        language: 'en-GB',

        init: function init() {
            this._super();

            var self = this;
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = this.get("language");

            recognition.onstart = function () {
                console.info('recognition:start');
                self.set("isActive", true);
                self.trigger("start");
            };

            recognition.onresult = function (event) {
                console.info('recognition:result', event);
                self.trigger("result", event);

                // Stop recognition once there's final result
                var results = event.results;
                if (results.length) {
                    if (results[0].isFinal) {
                        recognition.abort();
                    }
                }
            };

            recognition.onend = function (event) {
                console.info('recognition:end', event);
                self.set("isActive", false);
                self.trigger("end", event);
            };

            recognition.onerror = function () {
                console.info('recognition:error', event);
                self.set("isActive", false);
                self.trigger("error", event);
            };

            this.set("recognition", recognition);
        },

        start: function start() {
            this.get("recognition").start();
        },

        stop: function stop() {
            this.get("recognition").stop();
        },

        languageHasChanged: (function () {
            var language = this.get("language");
            var recognition = this.get("recognition");

            recognition.lang = language;

            if (this.get('isActive')) {
                recognition.stop();
                recognition.start();
            }
        }).observes("language")
    });

});
define('webrtc-translate/services/tour', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend({
        init: function init() {
            this._super();

            var tour = new window.Shepherd.Tour({
                defaults: {
                    classes: 'shepherd-theme-arrows shepherd-element-aint-no-river-wide-enough'
                }
            });

            tour.addStep('step-1', {
                title: 'Welcome to Render.Language!',
                text: 'This app allows you to have a 1-to-1 video call and will translate what the other person is saying.',
                buttons: [{
                    text: 'Next',
                    action: tour.next
                }]
            });

            tour.addStep('step-2', {
                text: 'Click to select the language you speak in.',
                attachTo: '.language-local',
                buttons: [{
                    text: 'Back',
                    action: tour.back
                }, {
                    text: 'Next',
                    action: tour.next
                }]
            });

            tour.addStep('step-3', {
                text: 'See the language the other person speaks in.',
                attachTo: '.language-remote',
                buttons: [{
                    text: 'Back',
                    action: tour.back
                }, {
                    text: 'Next',
                    action: tour.next
                }]
            });

            tour.addStep('step-4', {
                text: "<p><b>After the other person connects</b>, click here to start speech recognition. It will stop automatically when you stop speaking.</p><p>When doing it for the first time, you'll need to allow mic access.</p>",
                attachTo: {
                    element: '.speech-recognition-button',
                    on: 'bottom'
                },
                buttons: [{
                    text: 'Back',
                    action: tour.back
                }, {
                    text: 'Next',
                    action: tour.next
                }]
            });

            tour.addStep('step-5', {
                title: "That's it!",
                text: "<p>Send address of this page to another person to get started.</p>",
                buttons: [{
                    text: 'Back',
                    action: tour.back
                }, {
                    text: 'Okay, got it!',
                    action: tour.next
                }]
            });

            this.tour = tour;
        },

        start: function start() {
            this.tour.start();
        }
    });

});
define('webrtc-translate/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[2,2],[2,12]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/templates/components/language-select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0-beta.4",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 6,
              "column": 2
            }
          },
          "moduleName": "webrtc-translate/templates/components/language-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0,1,1);
          return morphs;
        },
        statements: [
          ["attribute","value",["concat",[["get","item",["loc",[null,[3,21],[3,25]]]]]]],
          ["attribute","selected",["subexpr","is-equal",[["get","item",["loc",[null,[3,49],[3,53]]]],["get","selectedValue",["loc",[null,[3,54],[3,67]]]]],[],["loc",[null,[3,38],[3,69]]]]],
          ["content","item",["loc",[null,[4,6],[4,14]]]]
        ],
        locals: ["item"],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/language-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("select");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createMorphAt(element1,1,1);
        return morphs;
      },
      statements: [
        ["element","action",["change"],["on","change"],["loc",[null,[1,8],[1,39]]]],
        ["block","each",[["get","content",["loc",[null,[2,10],[2,17]]]]],["key","@index"],0,null,["loc",[null,[2,2],[6,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('webrtc-translate/templates/components/message-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": false,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/message-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","content-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","content-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createUnsafeMorphAt(element0,1,1);
        morphs[2] = dom.createAttrMorph(element1, 'class');
        morphs[3] = dom.createUnsafeMorphAt(element1,1,1);
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",["content original-content ",["subexpr","if",[["get","message.originalContent",["loc",[null,[2,45],[2,68]]]],"visible","hidden"],[],["loc",[null,[2,40],[2,89]]]]]]],
        ["content","message.formattedOriginalContent",["loc",[null,[3,4],[3,42]]]],
        ["attribute","class",["concat",["content translated-content ",["subexpr","if",[["get","message.translatedContent",["loc",[null,[7,47],[7,72]]]],"visible","hidden"],[],["loc",[null,[7,42],[7,93]]]]]]],
        ["content","message.translatedContent",["loc",[null,[8,4],[8,35]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/templates/components/message-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0-beta.4",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "webrtc-translate/templates/components/message-list.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","message-item",[],["message",["subexpr","@mut",[["get","message",["loc",[null,[2,25],[2,32]]]]],[],[]]],["loc",[null,[2,2],[2,34]]]]
        ],
        locals: ["message"],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/message-list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","each",[["get","messages",["loc",[null,[1,8],[1,16]]]]],[],0,null,["loc",[null,[1,0],[3,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('webrtc-translate/templates/components/speech-volume-oscillator', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/speech-volume-oscillator.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("canvas");
        dom.setAttribute(el1,"width","64");
        dom.setAttribute(el1,"height","64");
        dom.setAttribute(el1,"class","circle center");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/templates/components/start-speech-recognition-button', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/start-speech-recognition-button.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createAttrMorph(element1, 'class');
        morphs[2] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["element","action",["toggleRecognition"],[],["loc",[null,[1,5],[1,35]]]],
        ["attribute","class",["concat",["flag circle center ",["get","flagName",["loc",[null,[2,35],[2,43]]]]]]],
        ["inline","speech-volume-oscillator",[],["stream",["subexpr","@mut",[["get","stream",["loc",[null,[3,36],[3,42]]]]],[],[]],"isSpeechRecognitionActive",["subexpr","@mut",[["get","isSpeechRecognitionActive",["loc",[null,[3,69],[3,94]]]]],[],[]]],["loc",[null,[3,2],[3,96]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/templates/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/error.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","vertical-center text-center");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Unfortunately, your browser is currently not supported.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Consider using the latest version of ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","http://chrome.com");
        var el4 = dom.createTextNode("Google Chrome");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(".");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/templates/room', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": false,
        "revision": "Ember@2.1.0-beta.4",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 34,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/room.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-sm-3 text-center");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","language language-local");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","language-select");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-sm-6 text-center");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"id","local-video");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"id","remote-video");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-sm-3 text-center");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","language language-remote");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("hr");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        dom.setAttribute(el1,"class","chat-form text-center");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1, 1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element0, [5, 1, 1]);
        var element5 = dom.childAt(fragment, [6]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createAttrMorph(element3, 'class');
        morphs[3] = dom.createMorphAt(element2,3,3);
        morphs[4] = dom.createMorphAt(element4,1,1);
        morphs[5] = dom.createMorphAt(element4,3,3);
        morphs[6] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[7] = dom.createElementMorph(element5);
        morphs[8] = dom.createMorphAt(element5,1,1);
        return morphs;
      },
      statements: [
        ["inline","language-select",[],["content",["subexpr","@mut",[["get","recognition.languages",["loc",[null,[5,34],[5,55]]]]],[],[]],"action",["subexpr","action",[["subexpr","mut",[["get","localSpeechLanguage",["loc",[null,[5,76],[5,95]]]]],[],["loc",[null,[5,71],[5,96]]]]],[],["loc",[null,[5,63],[5,97]]]]],["loc",[null,[5,8],[5,99]]]],
        ["inline","language-flag",[],["language",["subexpr","@mut",[["get","localSpeechLanguage",["loc",[null,[6,33],[6,52]]]]],[],[]]],["loc",[null,[6,8],[6,54]]]],
        ["attribute","class",["concat",["videos ",["subexpr","if",[["get","isRemoteVideo",["loc",[null,[11,28],[11,41]]]],"remote-video-on","remote-video-off"],[],["loc",[null,[11,23],[11,80]]]]]]],
        ["inline","start-speech-recognition-button",[],["language",["subexpr","@mut",[["get","localSpeechLanguage",["loc",[null,[15,47],[15,66]]]]],[],[]],"stream",["subexpr","@mut",[["get","localMediaStream",["loc",[null,[15,74],[15,90]]]]],[],[]]],["loc",[null,[15,4],[15,92]]]],
        ["content","remoteSpeechLanguage",["loc",[null,[20,8],[20,32]]]],
        ["inline","language-flag",[],["language",["subexpr","@mut",[["get","remoteSpeechLanguage",["loc",[null,[21,33],[21,53]]]]],[],[]]],["loc",[null,[21,8],[21,55]]]],
        ["inline","message-list",[],["messages",["subexpr","@mut",[["get","messages",["loc",[null,[27,24],[27,32]]]]],[],[]]],["loc",[null,[27,0],[27,34]]]],
        ["element","action",["handleChatMessage"],["on","submit"],["loc",[null,[31,6],[31,48]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","chatMessage.originalContent",["loc",[null,[32,16],[32,43]]]]],[],[]],"placeholder","Type a message here"],["loc",[null,[32,2],[32,79]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('webrtc-translate/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - app.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/language-flag.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/language-flag.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/language-flag.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/language-select.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/language-select.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/language-select.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/message-item.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/message-item.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/message-item.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/message-list.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/message-list.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/message-list.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/speech-volume-oscillator.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/speech-volume-oscillator.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/speech-volume-oscillator.js should pass jshint.');
  });

});
define('webrtc-translate/tests/components/start-speech-recognition-button.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components/start-speech-recognition-button.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'components/start-speech-recognition-button.js should pass jshint.');
  });

});
define('webrtc-translate/tests/controllers/room.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/room.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/room.js should pass jshint.');
  });

});
define('webrtc-translate/tests/helpers/is-equal.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers/is-equal.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/is-equal.js should pass jshint.');
  });

});
define('webrtc-translate/tests/helpers/resolver', ['exports', 'ember/resolver', 'webrtc-translate/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('webrtc-translate/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers/resolver.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });

});
define('webrtc-translate/tests/helpers/start-app', ['exports', 'ember', 'webrtc-translate/app', 'webrtc-translate/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('webrtc-translate/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers/start-app.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });

});
define('webrtc-translate/tests/integration/components/language-flag-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('language-flag', 'Integration | Component | language flag', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(1);

    this.set('language', 'en-GB');
    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'topLevel': null,
          'revision': 'Ember@2.1.0-beta.4',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 35
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'language-flag', [], ['language', ['subexpr', '@mut', [['get', 'language', ['loc', [null, [1, 25], [1, 33]]]]], [], []]], ['loc', [null, [1, 0], [1, 35]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.ok(this.$('div').hasClass('GB'));
  });

});
define('webrtc-translate/tests/integration/components/language-flag-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components/language-flag-test.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/language-flag-test.js should pass jshint.');
  });

});
define('webrtc-translate/tests/models/message.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models/message.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'models/message.js should pass jshint.');
  });

});
define('webrtc-translate/tests/models/volume-analyser.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models/volume-analyser.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'models/volume-analyser.js should pass jshint.');
  });

});
define('webrtc-translate/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - router.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });

});
define('webrtc-translate/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/index.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass jshint.');
  });

});
define('webrtc-translate/tests/routes/room.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/room.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'routes/room.js should pass jshint.');
  });

});
define('webrtc-translate/tests/services/speech-recognition.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services/speech-recognition.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'services/speech-recognition.js should pass jshint.');
  });

});
define('webrtc-translate/tests/services/tour.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services/tour.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'services/tour.js should pass jshint.');
  });

});
define('webrtc-translate/tests/test-helper', ['webrtc-translate/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('webrtc-translate/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - test-helper.js');
  QUnit.test('should pass jshint', function(assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('webrtc-translate/config/environment', ['ember'], function(Ember) {
  var prefix = 'webrtc-translate';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("webrtc-translate/tests/test-helper");
} else {
  require("webrtc-translate/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true,"name":"webrtc-translate","version":"0.0.0+2f119bd0"});
}

/* jshint ignore:end */
//# sourceMappingURL=webrtc-translate.map