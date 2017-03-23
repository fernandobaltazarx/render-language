define('webrtc-translate/components/message-item', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['message'],
        classNameBindings: ['message.isRemote:remote:local']
    });
});