define('webrtc-translate/components/language-flag', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['flag'],
        classNameBindings: ['flagName'],

        flagName: _ember['default'].computed('language', function () {
            var language = this.get('language');

            if (language) {
                return language.split('-')[1].toUpperCase();
            }
        })
    });
});