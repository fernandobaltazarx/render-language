define('webrtc-translate/components/message-list', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['chat'],
        messages: [],

        scrollChatToBottom: _ember['default'].observer('messages.[]', function () {
            var element = this.$();

            // Wait till the view is updated
            if (element) {
                _ember['default'].run.schedule('afterRender', function () {
                    element.scrollTop(element.prop('scrollHeight'));
                });
            }
        })
    });
});