define('webrtc-translate/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'webrtc-translate/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _webrtcTranslateConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_webrtcTranslateConfigEnvironment['default'].APP.name, _webrtcTranslateConfigEnvironment['default'].APP.version)
  };
});