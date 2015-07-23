/*
* <Brian K. Hsieh>
 * Flush stats to udp in json formate.
 *
 * To enable this backend, include 'statsd-json-udp-backend' in the backends
 * configuration array:
 *
 *   backends: ['statsd-json-udpbackend']
 *
 * The backend will read the configuration options from the following
 * 'json-udp' hash defined in the main statsd config file:
 *    {
 *      jsonUdp: {
 *       type: 'lmm-metric',
 *       port: "9999",
 *     },
 * Each data point is sent seperated in the following format.
 *    {
 *       "flushTimestamp" => 1406828678000,
 *                    "type" => "lmm-metric",
 *     "lmm.demo2.time.mean" => 0.3333333333333333,
 *
 *    }
 *
 */
var util = require('util'), dgram = require('dgram');
var os = require('os');
var fs = require('fs');

function JsonUdpBackend(startupTime, config, emitter, udpger) {
  var self = this;
  this.lastFlush = startupTime;
  this.lastException = startupTime;
  this.config = config.jsonUdp || {};
  this.udpger = udpger;
  this.hostname = this.config.hostname || 'localhost';
  this.port = this.config.port || '9999';
  this.sock =  dgram.createSocket('udp4');
  // Attach DNS error handler
  this.sock.on('error', function (err) {
    if (debug) {
      l.udp('Repeater error: ' + err);
    }
  });

  // attach
  emitter.on('flush',
    function(timestamp, metrics) {
      self.flush(timestamp, metrics);
    });
  emitter.on('status', function(callback) { self.status(callback); });
}

JsonUdpBackend.prototype.flush = function(timestamp, metrics) {
  var self = this;
  if (parseInt(metrics.counters['statsd.packets_received']) === 0) {
    return true;
  }
  var ts = timestamp * 1000;
  var type = this.config.type || os.hostname();
  var counters = metrics.counters;
  for (var key in counters) {
    /* Do not include statsd counters. */
    if (key.match(/^statsd\./)) {
      continue;
    }
    var output = jsonify(ts, type, key + '.counter', '', counters[key]);
    emitJsonUdp(self, output);
  }

  // gauges
  var gauges = metrics.gauges;
  for (var key in gauges) {
    /* Do not include statsd counters. */
    if (key.match(/^statsd\./)) {
      continue;
    }
    var output = jsonify(ts, type, key + '.gauge', '', gauges[key])
    emitJsonUdp(self, output);
  }

  // timers
  // From statsd, please ignore the coding style error for timer_data
  var timers = metrics.timer_data;
  for (var key in timers) {
    var data = timers[key];
    for (var item in data) {
      var output = jsonify(ts, type, key + '.timer', item, data[item]);
      emitJsonUdp(self, output);
    }
  }

  return true;
};
function jsonify(ts, type, name, typeInstance, value) {
  var output = {
    flushTimestamp: ts,
    type: type,
  };
  output['name'] = name;
  output['value'] = value;
  output['host'] = os.hostname();
  output['type_instance'] = typeInstance;
  output = JSON.stringify(output) + '\n';
  return output;
}
function emitJsonUdp(self, result) {
  var out = new Buffer (result);
  self.sock.send(out, 0, out.length, self.port, self.hostname,
    function(err, bytes) {
      if (err && debug) {
        l.udp(err);
      }
    });
};

JsonUdpBackend.prototype.status = function(write) {
  ['lastFlush', 'lastException'].forEach(function(key) {
    write(null, 'statsd-json-udp-backend', key, this[key]);
  }, this);
};

exports.init = function(startupTime, config, events) {
  var instance = new JsonUdpBackend(startupTime, config, events);
  return true;
};

module.exports.jsonify = jsonify;
