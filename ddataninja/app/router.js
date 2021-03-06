import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('intro-page');
  this.route('about');
  this.route('contact');
  this.route('map');
  this.route('target');
});

export default Router;
