if (typeof window !== 'undefined') {
  window.orientationStream = new Meteor.Stream('orient');
} else {
  orientationStream = new Meteor.Stream('orient');
}
