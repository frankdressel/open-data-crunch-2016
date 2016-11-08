import DS from 'ember-data';

export default DS.Adapter.extend({
    findRecord:function(store, type, id){
        var idObject=JSON.parse(id);
        console.log(idObject);

        console.log('find');

        return new Promise(function(resolve, reject){
            $.getJSON('http://82.165.76.96:8123/connection/', idObject, function(data){
            //$.getJSON('http://localhost:8123/connection/', idObject, function(data){
                console.log(data);
                var result=data;
                result.id=id;
                resolve(result);
            }).
            fail(function(error){
                console.log(error);
                reject(error);
            });
        });
    },
    createRecord:function(){},
    updateRecord:function(){},
    deleteRecord:function(){},
    findAll:function(){},
    query:function(){}
});
