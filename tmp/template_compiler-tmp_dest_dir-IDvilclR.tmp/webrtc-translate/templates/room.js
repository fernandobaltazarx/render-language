export default Ember.HTMLBars.template((function() {
  return {
    meta: {
      "fragmentReason": {
        "name": "missing-wrapper",
        "problems": [
          "multiple-nodes",
          "wrong-type"
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
          "line": 34,
          "column": 0
        }
      },
      "moduleName": "webrtc-translate/templates/room.hbs"
    },
    isEmpty: false,
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","row");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-sm-3 text-center");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","language language-local");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","language-select");
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-sm-6 text-center");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","local-video");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","remote-video");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-sm-3 text-center");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","language language-remote");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createComment("");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("hr");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("form");
      dom.setAttribute(el1,"class","chat-form text-center");
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
      var element1 = dom.childAt(element0, [1, 1, 1]);
      var element2 = dom.childAt(element0, [3]);
      var element3 = dom.childAt(element2, [1]);
      var element4 = dom.childAt(element0, [5, 1, 1]);
      var element5 = dom.childAt(fragment, [6]);
      var morphs = new Array(9);
      morphs[0] = dom.createMorphAt(element1,1,1);
      morphs[1] = dom.createMorphAt(element1,3,3);
      morphs[2] = dom.createAttrMorph(element3, 'class');
      morphs[3] = dom.createMorphAt(element2,3,3);
      morphs[4] = dom.createMorphAt(element4,1,1);
      morphs[5] = dom.createMorphAt(element4,3,3);
      morphs[6] = dom.createMorphAt(fragment,2,2,contextualElement);
      morphs[7] = dom.createElementMorph(element5);
      morphs[8] = dom.createMorphAt(element5,1,1);
      return morphs;
    },
    statements: [
      ["inline","language-select",[],["content",["subexpr","@mut",[["get","recognition.languages",["loc",[null,[5,34],[5,55]]]]],[],[]],"action",["subexpr","action",[["subexpr","mut",[["get","localSpeechLanguage",["loc",[null,[5,76],[5,95]]]]],[],["loc",[null,[5,71],[5,96]]]]],[],["loc",[null,[5,63],[5,97]]]]],["loc",[null,[5,8],[5,99]]]],
      ["inline","language-flag",[],["language",["subexpr","@mut",[["get","localSpeechLanguage",["loc",[null,[6,33],[6,52]]]]],[],[]]],["loc",[null,[6,8],[6,54]]]],
      ["attribute","class",["concat",["videos ",["subexpr","if",[["get","isRemoteVideo",["loc",[null,[11,28],[11,41]]]],"remote-video-on","remote-video-off"],[],["loc",[null,[11,23],[11,80]]]]]]],
      ["inline","start-speech-recognition-button",[],["language",["subexpr","@mut",[["get","localSpeechLanguage",["loc",[null,[15,47],[15,66]]]]],[],[]],"stream",["subexpr","@mut",[["get","localMediaStream",["loc",[null,[15,74],[15,90]]]]],[],[]]],["loc",[null,[15,4],[15,92]]]],
      ["content","remoteSpeechLanguage",["loc",[null,[20,8],[20,32]]]],
      ["inline","language-flag",[],["language",["subexpr","@mut",[["get","remoteSpeechLanguage",["loc",[null,[21,33],[21,53]]]]],[],[]]],["loc",[null,[21,8],[21,55]]]],
      ["inline","message-list",[],["messages",["subexpr","@mut",[["get","messages",["loc",[null,[27,24],[27,32]]]]],[],[]]],["loc",[null,[27,0],[27,34]]]],
      ["element","action",["handleChatMessage"],["on","submit"],["loc",[null,[31,6],[31,48]]]],
      ["inline","input",[],["value",["subexpr","@mut",[["get","chatMessage.originalContent",["loc",[null,[32,16],[32,43]]]]],[],[]],"placeholder","Type a message here"],["loc",[null,[32,2],[32,79]]]]
    ],
    locals: [],
    templates: []
  };
}()));