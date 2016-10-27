import Ember from 'ember';

export default Ember.Route.extend({
    targetService: Ember.inject.service('targetService'),
});
