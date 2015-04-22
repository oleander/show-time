import Ember from 'ember';
import config from './config/environment';

Ember.Handlebars.helper('truncate', function(text, options){
  var limit = options.hash.limit || 46;
  if (text.length > limit){
    text = text.substr(0, limit - 3) + "...";
  }
  return text;
});

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('current', { path: '/' });
  this.route('removed', { path: '/removed' });
  this.route('seen', { path: '/seen' });
  this.route('login', { path: '/login' });
  this.route('logout', { path: '/logout' });
});