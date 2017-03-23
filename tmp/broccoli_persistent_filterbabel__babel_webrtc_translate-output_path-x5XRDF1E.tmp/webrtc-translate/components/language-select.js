define("webrtc-translate/components/language-select", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Component.extend({
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