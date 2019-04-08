'use babel';

import Flow from "./flow.js";

export default class MetaprogrammingView {

  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.classList.add('metaprogramming');

    const message = document.createElement('div');
    message.textContent = 'Meta-programming Flow:';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
      var svg = document.getElementsByTagName("svg")
      var editor = atom.workspace.getActiveTextEditor()
      if(editor && (svg.length == 0)){
          this.createGraph(editor);
      }
  }

  reloadGraph() {
      Flow.removeSVG();
      var editor = atom.workspace.getActiveTextEditor()
      if(editor){
          this.createGraph(editor);
      }
  }

  createGraph(editor) {
    if(editor.getGrammar().packageName == "language-json"){
        Flow.render(".metaprogramming", JSON.parse(editor.getText()) );
    }
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
