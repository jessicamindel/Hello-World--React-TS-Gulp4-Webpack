'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _cssLoader = require('css-loader');

var _cssLoader2 = _interopRequireDefault(_cssLoader);

var _locals = require('css-loader/locals');

var _locals2 = _interopRequireDefault(_locals);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

require('colour');

var _cssModuleToInterface = require('./cssModuleToInterface');

var _persist = require('./persist');

var persist = _interopRequireWildcard(_persist);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function delegateToCssLoader(ctx, input, callback) {
  ctx.async = function () {
    return callback;
  };
  _cssLoader2.default.call(ctx, input);
}

module.exports = function (input) {
  var _this = this;

  if (this.cacheable) this.cacheable();

  // mock async step 1 - css loader is async, we need to intercept this so we get async ourselves
  var callback = this.async();

  var query = _loaderUtils2.default.parseQuery(this.query);
  var logger = (0, _logger2.default)(query.silent);

  var moduleMode = query.modules || query.module;
  if (!moduleMode) {
    logger('warn', 'Typings for CSS-Modules: option `modules` is not active - skipping extraction work...'.red);
    return delegateToCssLoader(this, input, callback);
  }

  // mock async step 2 - offer css loader a "fake" callback
  this.async = function () {
    return function (err, content) {
      if (err) {
        return callback(err);
      }
      var filename = _this.resourcePath;
      var cssModuleInterfaceFilename = (0, _cssModuleToInterface.filenameToTypingsFilename)(filename);

      var keyRegex = /"([^\\"]+)":/g;
      var match = void 0;
      var cssModuleKeys = [];

      while (match = keyRegex.exec(content)) {
        if (cssModuleKeys.indexOf(match[1]) < 0) {
          cssModuleKeys.push(match[1]);
        }
      }

      var cssModuleDefinition = void 0;
      if (!query.namedExport) {
        cssModuleDefinition = (0, _cssModuleToInterface.generateGenericExportInterface)(cssModuleKeys, filename);
      } else {
        var _filterNonWordClasses = (0, _cssModuleToInterface.filterNonWordClasses)(cssModuleKeys),
            _filterNonWordClasses2 = _slicedToArray(_filterNonWordClasses, 2),
            cleanedDefinitions = _filterNonWordClasses2[0],
            skippedDefinitions = _filterNonWordClasses2[1];

        if (skippedDefinitions.length > 0 && !query.camelCase) {
          logger('warn', ('Typings for CSS-Modules: option \'namedExport\' was set but \'camelCase\' for the css-loader not.\nThe following classes will not be available as named exports:\n' + skippedDefinitions.map(function (sd) {
            return ' - "' + sd + '"';
          }).join('\n').red + '\n').yellow);
        }
        cssModuleDefinition = (0, _cssModuleToInterface.generateNamedExports)(cleanedDefinitions);
      }
      persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleDefinition);
      // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
      delegateToCssLoader(_this, input, callback);
    };
  };
  _locals2.default.call(this, input);
};