import Ember from 'ember';

export default Ember.Service.extend({
    items: ['Tannenstrasse'],
    active: 'Tannenstrasse',
    addItem(newItem){
        this.items.push(newItem);
    }
});
