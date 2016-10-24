"use strict";

import ProtoBuf from 'protobufjs';
import CardboardDeviceProto from './CardboardDevice.proto';

// to and from URL-safe variant of base64 encoding
function base64ToUrl(s) {
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function base64FromUrl(s) {
  s = s + '==='.slice(0, [0, 3, 2, 1][s.length % 4]);
  return s.replace(/-/g, '+').replace(/_/g, '/');
}

var PARAMS_URI_PREFIX = 'http://google.com/cardboard/cfg?p=';

var DeviceParams = ProtoBuf.loadProto(CardboardDeviceProto).build().DeviceParams;

function paramsToUri(params) {
  var msg = new DeviceParams(params);
  return PARAMS_URI_PREFIX + base64ToUrl(msg.toBase64());
}

// TODO: support Cardboard v1 URI (i.e. default params)
function uriToParamsProto(uri) {
  uri = uri.replace('https://vr.google.com/cardboard/download/?p=', 'http://google.com/cardboard/cfg?p=');
  if (uri.substring(0, PARAMS_URI_PREFIX.length) !== PARAMS_URI_PREFIX) {
    return;
  }
  var base64_msg = base64FromUrl(uri.substring(PARAMS_URI_PREFIX.length));
  // TODO: round numeric values
  return DeviceParams.decode64(base64_msg);
}

// Returns plain object having only properties of interest.
function uriToParams(uri) {
  var source = uriToParamsProto(uri), dest = {}, k;
  for (k in source) {
    if (source.hasOwnProperty(k)) {
      dest[k] = source[k];
    }
  }
  return dest;
}

export default {
  DeviceParams: DeviceParams,
  paramsToUri: paramsToUri,
  uriToParams: uriToParams,
  uriToParamsProto: uriToParamsProto
};
