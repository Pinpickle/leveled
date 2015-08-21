import _ from 'lodash';

var internalLevel = { };

var store = {
  global: { },
  level: { }
};

// For debugging
window.levelStore = store;

var callbacks = [ ];

function setGlobal(state) {
  store.global = _.assign({
    gridSize: 24,
    layers: [ ],
    objects: { }
  }, state);

  store.global.layers = _.map(store.global.layers, function (layer, i) {
    return _.merge({
      type: 'object',
      name: 'layer-' + i
    }, layer);
  });

  store.global.objects.null = { };

  store.global.objects = _.mapValues(store.global.objects, function (object, name) {
    return _.merge({
      width: store.global.gridSize,
      height: store.global.gridSize,
      x: 0,
      y: 0,
      color: '#222222',
      shape: 'rect'
    }, object)
  });

  updateLevel();
}

function setLevel(state) {
  internalLevel = state;

  updateLevel();
}

function updateLevel() {
  store.level = _.assign({
    layers: { }
  }, _.cloneDeep(internalLevel));

  var layers = store.level.layers;

  store.level.gridSize = store.global.gridSize;
  store.level.layers = _.map(store.global.layers, function (layer, i) {
    layer = _.cloneDeep(layer);

    var levelLayer = store.level.layers[layer.name];
    if (levelLayer) {
      layer.contents = _.map(levelLayer, processLayerContent(layer));
    } else {
      layer.contents = [ ];
    }

    return layer;
  });
}

function processLayerContent(layer) {
  return function (object) {
    var objectPlacementType = getObjectPlacementType(object);
    var returnObject;
    var typeName = (object.type || layer.defaultObject) || 'null';
    var objectType = store.global.objects[typeName] || store.global.objects['null'];

    if (objectPlacementType === 'single') {
      var returnObject = _.merge({ }, objectType, object)
    }

    return returnObject;
  };
}

function getObjectPlacementType(object) {
  if (_.has(object, 'placementType')) {
    return object.placementType;
  }

  if (_.isString(object)) {
    return 'bitstring';
  }

  if (_.has(object, 'rectWidth') || _.has(object, 'rectHeight')) {
    return 'rect';
  }

  return 'single';
}

function emit() {
  callbacks.forEach(function (cb) {
    cb(store);
  });
}

setGlobal({ });

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
