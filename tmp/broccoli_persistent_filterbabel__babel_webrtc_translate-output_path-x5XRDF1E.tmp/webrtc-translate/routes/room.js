define('webrtc-translate/routes/room', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        beforeModel: function beforeModel() {
            var supports = {
                webRTC: !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection),
                webSpeech: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
                webAudio: !!window.AudioContext
            };

            if (!(supports.webRTC && supports.webSpeech && supports.webAudio)) {
                return _ember['default'].RSVP.reject();
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