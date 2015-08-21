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
    objects: { },
    defaults: {
      width: 1000,
      height: 1000
    }
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
  store.level = _.merge({
    layers: { },
    gridSize: store.global.gridSize
  }, store.global.defaults, _.cloneDeep(internalLevel));

  var layers = store.level.layers;

  store.level.layers = _.map(store.global.layers, function (layer, i) {
    layer = _.cloneDeep(layer);

    var levelLayer = store.level.layers[layer.name];
    if (levelLayer) {
      var process = processLayerContent(layer);
      layer.contents = [ ];

      _.each(levelLayer, function (object) {
        object = process(object);

        if (_.isArray(object)) {
          object.forEach(function (ob) {
            layer.contents.push(ob);
          });
        } else {
          layer.contents.push(object);
        }
      });
    } else {
      layer.contents = [ ];
    }

    return layer;
  });
}

function processLayerContent(layer) {
  return function (object) {
    var objectPlacementType = getObjectPlacementType(object);
    var typeName = (object.type || layer.defaultObject) || 'null';
    var objectType = store.global.objects[typeName] || store.global.objects['null'];

    var createObject = function () {
      return _.merge({ }, objectType, object);
    }

    switch (objectPlacementType) {
      case 'bitstring':
        var objects = [ ];
        var lines = object.placement.split(/[\r\n]+/g);
        lines.forEach(function (line, row) {
          for (var i = 0; i < line.length; i ++) {
            var ch = line[i];
            if (ch != '.') {
              var ob = createObject();
              ob.x += i * store.level.gridSize;
              ob.y += row * store.level.gridSize;
              objects.push(ob);
            }
          }
        });

        return objects;
      case 'rect':
        var objects = [ ];
        var width = (object.placement.width || 1);
        var height = (object.placement.height || 1);
        for (var x = 0; x < width; x ++) {
          for (var y = 0; y < height; y ++) {
            if ((!object.placement.outline) ||
              ((y == 0) || (y == height - 1) || (x == 0) || (x == width - 1))) {
              var ob = createObject();
              ob.x += x * store.level.gridSize;
              ob.y += y * store.level.gridSize;
              objects.push(ob);
            }
          }
        }

        return objects;
    }

    return createObject();
  };
}

function getObjectPlacementType(object) {
  if (_.has(object, 'placement')) {
    if (_.isString(object.placement)) {
      return 'bitstring';
    }

    if ((_.has(object.placement, 'width')) || (_.has(object.placement, 'height'))) {
      return 'rect';
    }
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
