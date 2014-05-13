#!/usr/bin/env node

var childprocess = require('child_process'),
	spawn = childprocess.spawn,
	exec = childprocess.exec,
    fs = require('fs');

function run(file, cb) {
	var fn = function (error, stdout, stderr) {
		console.log(error,stdout,stderr);
		if (error) return cb(error);
		cb(null,JSON.parse(stdout));
	};

	var child = exec('pandoc -f markdown -t json',fn);
	fs.createReadStream(file, {encoding: 'utf8'}).pipe(child.stdin);
}

run('README.md', function (err, data) {
	console.log(JSON.stringify(data,false,2));
});

/// WORKS!
// function run(file, cb) {
// 	var input = fs.createReadStream(file, {encoding: 'utf8'});
// 	var child = spawn('pandoc',['-f','markdown','-t','json']);  //['pipe','pipe',2]

// 	var output = '';

// 	child.stdout.setEncoding('utf8');
// 	child.stdout.on('data', function (data) {
// 		output += data
// 	});
// 	child.on('exit', function (code) {
// 		if (code !== 0) return cb(new Error('spawn exit ' + code));
// 		cb(null,output);
// 	});

// 	input.pipe(child.stdin);
// }

// run('README.md', function (err, json) {
// 	console.log(JSON.stringify(JSON.parse(json),false,2));
// })


// var input = fs.openSync('README.md', 'r'); //fs.createReadStream('README.md');

// var child = spawn(
// 	'pandoc',
// 	[
// 		'-f','markdown',
// 		'-t','json'
// 	],
// 	{
// 		stdio: [ input, 1, 2 ]
// 	}
// );

// child.on('exit', function (code) {
// 	//process.exit(code);
// 	console.log('exit');
// });








// child.stdin.resume();
// child.stdin.pipe(input);

// child.stdout.setEncoding('utf8');
// child.stdout.on('data', function (data) {
// 	proces.stdout.write(data);
// });

//  child.stdin.on('end', function() {
//    	process.stdout.write('REPL stream ended.');
//  });



