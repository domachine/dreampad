exports.updateState = function(state) {
  Dispatcher.dispatch({ type: 'UPDATE_STATE', state: state });
};
