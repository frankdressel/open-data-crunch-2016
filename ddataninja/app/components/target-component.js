import Ember from 'ember';

export default Ember.Component.extend({
    targetService: Ember.inject.service(),
    actions: {
        addNewStation: function(){
            this.get('targetService').addItem(Ember.Object.create({name: this.get('newStation'), latitude: this.get('latitude'), longitude: this.get('longitude')}));
            this.rerender();
        },
        select: function(item) {
            this.get('targetService').resort(item);
            this.rerender();
        }
    }
});
