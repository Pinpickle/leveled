import _ from 'lodash';

var store = {
  global: { },
  level: { }
};

var callbacks = [ ];

function setGlobal(state) {
  store.global = _.assign({
    gridSize: 24,
    layers: [ ]
  }, state);
}

function setLevel(state) {
  store.global = _.assign({

  }, state);
}

function emit() {
  callbacks.forEach(function (cb) {
    cb(store);
  });
}

setGlobal({ });
setLevel({ });

export function setContext(context, state) {
  switch (context) {
    case 'global':
      setGlobal(state);
      break;
    case 'level':
      setLevel(state);
      break;
  }

  emit();
}

export function getState() {
  return store;
}

export function subscribe(callback) {
  callbacks.push(callback);
}

export function unsubscribe(callback) {
  _.remove(callbacks, function (cb) {
    return cb === callback;
  });
}
