define("webrtc-translate/templates/components/language-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.6",
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
          morphs[2] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["concat", [["get", "item", ["loc", [null, [3, 21], [3, 25]]]]]]], ["attribute", "selected", ["subexpr", "is-equal", [["get", "item", ["loc", [null, [3, 49], [3, 53]]]], ["get", "selectedValue", ["loc", [null, [3, 54], [3, 67]]]]], [], ["loc", [null, [3, 38], [3, 69]]]]], ["content", "item", ["loc", [null, [4, 6], [4, 14]]]]],
        locals: ["item"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "modifiers",
          "modifiers": ["action"]
        },
        "revision": "Ember@2.4.6",
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
        morphs[1] = dom.createMorphAt(element1, 1, 1);
        return morphs;
      },
      statements: [["element", "action", ["change"], ["on", "change"], ["loc", [null, [1, 8], [1, 39]]]], ["block", "each", [["get", "content", ["loc", [null, [2, 10], [2, 17]]]]], ["key", "@index"], 0, null, ["loc", [null, [2, 2], [6, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});