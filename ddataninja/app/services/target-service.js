import Ember from 'ember';

export default Ember.Service.extend({
    items: [],
    active: null,
    init(){
        this._super(...arguments);
        var ldks=localStorage.getItem('ldks');
        if(localStorage.getItem('ldks')){
            this.set('items', JSON.parse(localStorage.getItem('ldks')));
        }
        else{
            this.set('items', []);
        }
    },
    addItem(newItem){
        this.get('items').insertAt(this.get('items').length, newItem);
        localStorage.setItem('ldks', JSON.stringify(this.get('items')));
    },
    resort(item){
        var index=this.get('items').indexOf(item);
        this.get('items').splice(index, 1);
        this.get('items').insertAt(0, item);
        localStorage.setItem('ldks', JSON.stringify(this.get('items')));
    }
});
