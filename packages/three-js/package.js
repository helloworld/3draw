Package.describe({
  name: 'three-js',
  version: '0.0.2',
  summary: 'Three.js for Meteor'
});

Package.onUse(function (api) {
  api.versionsFrom('2.16');
  api.addFiles('three.js', 'client');
  api.export('THREE', 'client');
});
