import Ember from 'ember';

export default Ember.Component.extend({
    targetService: Ember.inject.service(),
    tagName: '',
    //items: Ember.computed.filterBy('targetService.items.[]', 'active', true),
    item: Ember.computed.filter('targetService.items.[]', function(item, index, array){
        if(index==0){
            console.log(item.name);
        }
        return index==0;
    }),
    init(){
        this._super(...arguments);
    }
});
