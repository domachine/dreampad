var db = require('../database');

var loading = exports.loading = function(state) {
  exports.updateState({ isLoading: state == null ? true : state });
};

var saving = exports.saving = function(state) {
  exports.updateState({ isSaving: state == null ? true : state });
};

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
  loading();
  db.get(id)
    .then(function(res) {
      Dispatcher.dispatch({ type: 'LOAD_DOCUMENT',
        document: res });
      loading(false);
    }).catch(function() {
      loading(false);
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
      if (values.hasOwnProperty('_id')) {
        let router = require('../router');
        router.transitionTo('edit_document', { id: values._id });
      }
    }).catch(function(e) {
      console.error(e);
      saving(false);
    });
};
