;(function(){
	// var cluster = require('cluster');
	// if(cluster.isMaster){
	//   return cluster.fork() && cluster.on('exit', function(){ cluster.fork(); require('./node_modules/gun/lib/crashed.js'); });
	// }

	var fs = require('fs');
	var config = {
		port: process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 80,
		peers: process.env.PEERS && process.env.PEERS.split(',') || ["https://gun-us.herokuapp.com/gun"]
	};
	var Gun = require('gun');

	if(process.env.HTTPS_KEY){
		config.key = fs.readFileSync(process.env.HTTPS_KEY);
		config.cert = fs.readFileSync(process.env.HTTPS_CERT);
		config.server = require('https').createServer(config, Gun.serve(__dirname));
	} else {
		config.server = require('http').createServer(Gun.serve(__dirname));
	}

	var gun = Gun({web: config.server.listen(config.port), peers: config.peers, file: 'data/content.json'});
	console.log('Relay peer started on port ' + config.port + ' with /gun');


	// gun.get("#").map((v,k) => {
	// 	console.log(k);
	// })

	module.exports = gun;
}());
