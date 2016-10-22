import Ember from 'ember';

export default Ember.Component.extend({
    targetService: Ember.inject.service(),
    actions: {
        addNewStation: function(){
            this.get('targetService').addItem(this.get('newStation'));
            this.rerender();
        }
    }
});
