export default Ember.HTMLBars.template((function() {
  return {
    meta: {
      "fragmentReason": {
        "name": "modifiers",
        "modifiers": [
          "action"
        ]
      },
      "revision": "Ember@2.4.6",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 5,
          "column": 0
        }
      },
      "moduleName": "webrtc-translate/templates/components/start-speech-recognition-button.hbs"
    },
    isEmpty: false,
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element0 = dom.childAt(fragment, [0]);
      var element1 = dom.childAt(element0, [1]);
      var morphs = new Array(3);
      morphs[0] = dom.createElementMorph(element0);
      morphs[1] = dom.createAttrMorph(element1, 'class');
      morphs[2] = dom.createMorphAt(element0,3,3);
      return morphs;
    },
    statements: [
      ["element","action",["toggleRecognition"],[],["loc",[null,[1,5],[1,35]]]],
      ["attribute","class",["concat",["flag circle center ",["get","flagName",["loc",[null,[2,35],[2,43]]]]]]],
      ["inline","speech-volume-oscillator",[],["stream",["subexpr","@mut",[["get","stream",["loc",[null,[3,36],[3,42]]]]],[],[]],"isSpeechRecognitionActive",["subexpr","@mut",[["get","isSpeechRecognitionActive",["loc",[null,[3,69],[3,94]]]]],[],[]]],["loc",[null,[3,2],[3,96]]]]
    ],
    locals: [],
    templates: []
  };
}()));