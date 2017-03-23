define('webrtc-translate/router', ['exports', 'ember', 'webrtc-translate/config/environment'], function (exports, _ember, _webrtcTranslateConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _webrtcTranslateConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('room', { path: '/rooms/:room_id' });
  });

  exports['default'] = Router;
});