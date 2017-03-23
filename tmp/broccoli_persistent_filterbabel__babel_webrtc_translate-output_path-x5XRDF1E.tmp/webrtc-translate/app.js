define('webrtc-translate/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'webrtc-translate/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _webrtcTranslateConfigEnvironment) {

    var App;

    _ember['default'].MODEL_FACTORY_INJECTIONS = true;

    App = _ember['default'].Application.extend({
        modulePrefix: _webrtcTranslateConfigEnvironment['default'].modulePrefix,
        podModulePrefix: _webrtcTranslateConfigEnvironment['default'].podModulePrefix,
        Resolver: _emberResolver['default']
    });

    (0, _emberLoadInitializers['default'])(App, _webrtcTranslateConfigEnvironment['default'].modulePrefix);

    exports['default'] = App;
});