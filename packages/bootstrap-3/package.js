Package.describe({
  name: 'bootstrap-3',
  version: '3.1.1',
  summary: 'Bootstrap 3 for Meteor'
});

Package.onUse(function (api) {
  api.versionsFrom('2.16');
  api.addFiles('bootstrap.css', 'client');
});
