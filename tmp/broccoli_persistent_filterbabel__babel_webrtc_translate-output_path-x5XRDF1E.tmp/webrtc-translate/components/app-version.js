define('webrtc-translate/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'webrtc-translate/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _webrtcTranslateConfigEnvironment) {

  var name = _webrtcTranslateConfigEnvironment['default'].APP.name;
  var version = _webrtcTranslateConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});