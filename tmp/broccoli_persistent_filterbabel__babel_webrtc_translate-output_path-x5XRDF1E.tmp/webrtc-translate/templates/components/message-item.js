define("webrtc-translate/templates/components/message-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.4.6",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "webrtc-translate/templates/components/message-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "content-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "content-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createUnsafeMorphAt(element0, 1, 1);
        morphs[2] = dom.createAttrMorph(element1, 'class');
        morphs[3] = dom.createUnsafeMorphAt(element1, 1, 1);
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["content original-content ", ["subexpr", "if", [["get", "message.originalContent", ["loc", [null, [2, 45], [2, 68]]]], "visible", "hidden"], [], ["loc", [null, [2, 40], [2, 89]]]]]]], ["content", "message.formattedOriginalContent", ["loc", [null, [3, 4], [3, 42]]]], ["attribute", "class", ["concat", ["content translated-content ", ["subexpr", "if", [["get", "message.translatedContent", ["loc", [null, [7, 47], [7, 72]]]], "visible", "hidden"], [], ["loc", [null, [7, 42], [7, 93]]]]]]], ["content", "message.translatedContent", ["loc", [null, [8, 4], [8, 35]]]]],
      locals: [],
      templates: []
    };
  })());
});