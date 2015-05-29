var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function StateStore() {
  this._document = {};
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

StateStore.prototype.getDocument = function() {
  return this._document;
};

StateStore.prototype._loadDocument = function(document) {
  this._document = document;
  this.emitChange();
};

StateStore.prototype._updateDocument = function(document) {
  'use strict';

  for (let key in document) {
    let value = document[key];
    if (document.hasOwnProperty(key)) { this._document[key] = value; }
  }
  this.emitChange();
};


var store = module.exports = new StateStore();
store.dispatchToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'UPDATE_DOCUMENT': store._updateDocument(action.document); break;
    case 'LOAD_DOCUMENT': store._loadDocument(action.document); break;
  }
});
