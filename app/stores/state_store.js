var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function StateStore() {
  this._state = { mode: 'edit' };
}
inherits(StateStore, EventEmitter);

StateStore.prototype.addChangeListener = function(fn) {
  this.addListener('change', fn);
};

StateStore.prototype.removeChangeListener = function(fn) {
  this.removeListener('change', fn);
};

StateStore.prototype.emitChange = function() {
  this.emit('change');
};

StateStore.prototype.getState = function() {
  return this._state;
};

StateStore.prototype._updateState = function(state) {
  'use strict';

  for (var key in state) {
    let value = state[key];
    if (!state.hasOwnProperty(key)) { continue; }
    this._state[key] = value;
  }
  this.emitChange();
};

var store = module.exports = new StateStore();
store.dispatchToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'UPDATE_STATE': store._updateState(action.state); break;
  }
});
