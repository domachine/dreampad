var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function StateStore() {
  this._documents = [];
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

StateStore.prototype.getDocuments = function() {
  return this._documents;
};

StateStore.prototype._addDocument = function(document) {
  this._documents.push(document);
  this.emitChange();
};

StateStore.prototype._loadDocuments = function(documents) {
  this._documents = documents;
  this.emitChange();
};

var store = module.exports = new StateStore();
store.dispatchToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case 'INSERT_DOCUMENT': store._addDocument(action.document); break;
    case 'LOAD_DOCUMENTS': store._loadDocuments(action.documents); break;
  }
});
