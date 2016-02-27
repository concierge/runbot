var Sandbox = require.safe("sandbox"),
	sandbox = new Sandbox(),
	
runCode = function(prefix, data, output) {
	var code = data.substr(prefix.length + 6);
	sandbox.run(code, output);
};

exports.match = function(text, commandPrefix) {
	return text.startsWith(commandPrefix + 'runbot');
};

exports.help = function(commandPrefix) {
	return [[commandPrefix + 'runbot <jscode>','Runs JS code.']];
};

exports.run = function(api, event) {
	runCode(api.commandPrefix, event.body, function(output) {
		var out = '';

		if (output.console.length > 0) {
			out += 'Console Output:\n-----------------------\n';
		}

		for (var i = 0; i < output.console.length; i++) {
			out += output.console[i] + '\n';
		}

		if (output.result !== 'null') {
			if (output.console.length > 0) {
				out += '\n';
			}
			out += 'Result:\n-----------------------\n';
			switch (output.result) {
				case 'TimeoutError': {
					out += 'Time limit exceeded (500ms).\n';
					break;
				}
				case 'Error':
				case '\'undefined: undefined\'': {
					out += 'An exception was thrown.\n';
					break;
				}
				default: {
					out += output.result + '\n';
					break;
				}
			}
		}

		if (out === '\n') {
			out = 'No output was returned from running your code.';
		}

		api.sendMessage(out, event.thread_id);
	});
};
