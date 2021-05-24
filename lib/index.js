"use strict";

exports.__esModule = true;

var _MessageContext = _interopRequireDefault(require("./MessageContext"));

exports.MessageContext = _MessageContext["default"];

var _UserContext = _interopRequireDefault(require("./UserContext"));

exports.UserContext = _UserContext["default"];

var _DDBContext = _interopRequireDefault(require("./DDBContext"));

exports.DDBContext = _DDBContext["default"];

var _LambdaContext = _interopRequireDefault(require("./LambdaContext"));

exports.LambdaContext = _LambdaContext["default"];

var _AppConfigContext = _interopRequireWildcard(require("./AppConfigContext"));

exports.AppConfigContext = _AppConfigContext["default"];
exports.makeAppConfig = _AppConfigContext.makeAppConfig;

var _BaseApp = _interopRequireDefault(require("./BaseApp"));

exports.BaseApp = _BaseApp["default"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }