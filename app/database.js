var db = exports = module.exports = new PouchDB('dreampad', { adapter: 'localstorage' });

var ddoc = {
  _id: '_design/dreampad',
  views: {
    documents: {
      map: function(doc) {
        if (doc.type === 'document') { emit(doc._id); }
      }.toString()
    }
  }
};

exports.install = function() {
  return db.put(ddoc);
};
