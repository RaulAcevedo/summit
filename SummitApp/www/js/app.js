
require.config({
	baseUrl:'js/',
	paths:{
		jquery:'jquery',
		famous:'famous.min',
		data:'lib/data',
		responsive:'lib/responsive'
	}
});

function loadCordova(Summit,$){

	Summit.initialize($);
	
	require(['cordova.js'],function(){
		var exec = cordova.require('cordova/exec');
	});
}

requirejs(['famous','data'],function(){
	require(['summit','jquery'],function(Summit,$){
       loadCordova(Summit,$);
	});
});