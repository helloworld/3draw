Package.describe({
  name: 'streams',
  version: '0.1.17',
  summary: 'DB less realtime communication for meteor'
});

Package.onUse(function (api) {
  api.versionsFrom('2.16');
  api.use('underscore', ['client', 'server']);
  api.use('check', 'server');
  api.use('random', 'server');
  api.use('insecure', {weak: true});
  api.addFiles(['lib/ev.js', 'lib/server.js', 'lib/stream_permission.js'], 'server');
  api.addFiles(['lib/ev.js', 'lib/client.js'], 'client');
});
