'use babel';

import MetaprogrammingView from './metaprogramming-view';
import { CompositeDisposable } from 'atom';

export default {

  metaprogrammingView: null,
  panel: null,
  subscriptions: null,

  activate(state) {
    this.state = state;
    this.metaprogrammingView = new MetaprogrammingView(state.metaprogrammingViewState);
    // addBottomPanel(options)
    // addRightPanel
    this.panel = atom.workspace.addBottomPanel({
       item: this.metaprogrammingView.getElement(),
       visible: false
    });
    //
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'metaprogramming:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'metaprogramming:reload': () => this.reload()
    }));

    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'metaprogramming:save': () => this.save()
    // }));

  },

  deactivate() {
    this.panel.destroy();
    this.subscriptions.dispose();
    this.metaprogrammingView.destroy();
  },

  serialize() {
    return {
      metaprogrammingViewState: this.metaprogrammingView.serialize()
    };
  },

  reload() {
      console.log("metaprogramming:reload");
      this.panel.reload();
  },

  toggle() {
    return (
      this.panel.isVisible() ?
      this.panel.hide() :
      this.panel.show()
    );
  }

};
