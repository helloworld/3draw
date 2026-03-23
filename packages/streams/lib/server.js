var EventEmitter = Npm.require('events').EventEmitter;
var util = Npm.require('util');

Meteor.Stream = function Stream(name) {
  EV.call(this);

  var self = this;
  var streamName = 'stream-' + name;
  var filters = [];

  self.name = name;

  var events = new EventEmitter();
  events.setMaxListeners(0);

  var disconnectEvents = new EV();

  self._emit = self.emit;
  self.emit = function emit() {
    self.emitToSubscriptions(arguments, null, null);
  };

  var defaultResult = (typeof(Package) == 'object' && Package.insecure) ? true : false;
  self.permissions = new Meteor.Stream.Permission(defaultResult, true);

  self.addFilter = function addFilter(callback) {
    filters.push(callback);
  };

  self.emitToSubscriptions = function emitToSubscriptions(args, subscriptionId, userId) {
    events.emit('item', {args: args, userId: userId, subscriptionId: subscriptionId});
  };

  Meteor.publish(streamName, function() {
    check(arguments, Match.Any);
    var subscriptionId = Random.id();
    var publication = this;

    publication.added(streamName, subscriptionId, {type: 'subscriptionId'});
    publication.ready();
    events.on('item', onItem);

    function onItem(item) {
      try {
        var id = Random.id();
        if(self.permissions.checkPermission('read', subscriptionId, publication.userId, item.args)) {
          if(subscriptionId != item.subscriptionId) {
            publication.added(streamName, id, item);
            publication.removed(streamName, id);
          }
        }
      } catch(e) {
        console.error('Stream error:', e);
      }
    }

    publication.onStop(function() {
      try {
        disconnectEvents.emit(subscriptionId);
        disconnectEvents.removeAllListeners(subscriptionId);
      } catch(e) {}
      events.removeListener('item', onItem);
    });
  });

  var methods = {};
  methods[streamName] = function(subscriptionId, args) {
    check(arguments, Match.Any);
    var userId = this.userId;
    var methodContext = {};
    methodContext.userId = userId;
    methodContext.subscriptionId = subscriptionId;

    methodContext.allowed = self.permissions.checkPermission('write', subscriptionId, methodContext.userId, args);
    if(methodContext.allowed) {
      args = applyFilters(args, methodContext);
      self.emitToSubscriptions(args, subscriptionId, methodContext.userId);
      if(self.firehose) {
        self.firehose(args, subscriptionId, methodContext.userId);
      }
    }
    self._emit.apply(methodContext, args);

    if(typeof(methodContext.onDisconnect) == 'function') {
      disconnectEvents.on(subscriptionId, methodContext.onDisconnect);
    }
  };
  Meteor.methods(methods);

  function applyFilters(args, context) {
    var eventName = args.shift();
    filters.forEach(function(filter) {
      args = filter.call(context, eventName, args);
    });
    args.unshift(eventName);
    return args;
  }
};

util.inherits(Meteor.Stream, EV);
