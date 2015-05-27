var db = require('../database');

function loading(state) {
  exports.updateState({ isLoading: state == null ? true : state });
}

function saving(state) {
  exports.updateState({ isSaving: state == null ? true : state });
}

exports.updateState = function(state) {
  Dispatcher.dispatch({ type: 'UPDATE_STATE', state: state });
};

exports.createDocument = function(document) {
  document.type = 'document';
  db.put(document)
    .then(function(res) {
      document._rev = res.rev;
      Dispatcher.dispatch({ type: 'INSERT_DOCUMENT', document: document });
    }).catch(function(err) {
      console.error(err);
    });
};

exports.loadDocuments = function() {
  var StateStore = require('../stores/state_store');
  loading();
  db.query('dreampad/documents')
    .then(function(res) {
      Dispatcher.dispatch({ type: 'LOAD_DOCUMENTS',
        documents: res.rows.map(function(row) {
          return { _id: row.id, _rev: row._rev };
        })
      });
      loading(false);
    }).catch(function() {
      loading(false);
    });
};

exports.loadDocument = function(id) {
  exports.updateState({ isLoading: true });
  db.get(id)
    .then(function(res) {
      Dispatcher.dispatch({ type: 'LOAD_DOCUMENT',
        document: res });
      exports.updateState({ isLoading: false });
    }).catch(function() {
      exports.updateState({ isLoading: false });
    });
};

exports.updateDocument = function(values) {
  'use strict';

  var doc = {};
  for (let key in values) {

    // I'm explicitly looping over prototype.
    let value = values[key];
    doc[key] = value;
  }
  saving();
  db.put(doc)
    .then(function(res) {
      doc._rev = res.rev;
      Dispatcher.dispatch({ type: 'UPDATE_DOCUMENT', document: doc });
      saving(false);
    }).catch(function() {
      saving(false);
    });
};
