/**
 * @license Copyright (c) 2010 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */
define([], function() {
	var timer = createTimer(),
		objectCount = 0;
	
	function msg(text) {
		return "DEBUG: " + text;
	}

	function time(text) {
		return msg(text) + " (" + timer() + ")";
	}

	/*
		Function: createTimer
		Creates a timer function that, when called, returns an object containing
		the total elapsed time since the timer was created, and the split time
		since the last time the timer was called.  All times in milliseconds

		Returns:
		Timer function
	*/
	function createTimer() {
		var start = new Date().getTime(),
			split = start;

		/*
			Function: getTime
			Returns the total elapsed time since this timer was created, and the
			split time since this getTime was last called.

			Returns:
			Object containing total and split times in milliseconds, plus a
			toString() function that is useful in logging the time.
		*/
		return function getTime() {
			var now = new Date().getTime(),
				total = now - start,
				splitTime = now - split;
			split = now;

			return {
				total: total,
				split: splitTime,
				toString: function() {
					return '' + splitTime + 'ms / ' + total + 'ms';
				}
			};
		};
	}
	
	/*
		Function: logProgress
		Logs progress info to the console
		
		Parameters:
			progress - progress Object with status, target, and spec
				- target - Object - object whose status is being reported
				- status - String - current status of object
				- spec: Any - wiring spec
	*/
	function logProgress(progress) {
		// progress:
		console.log(time('Object ' + progress.status), progress.target, progress.spec);
	}
	
	return {
		/*
			Function: wire$init
			Does any initialization for this plugin as soon as it is loaded. This is only
			called once when the plugin is loaded, and never again.
		*/
		wire$init: function() {
			console.log(time("All modules loaded"));
		},
		/*
			Function: wire$wire
			Invoked when wiring starts and provides two promises: one for wiring the context,
			and one for destroying the context.  Plugins should register resolve, reject, and
			promise handlers as necessary to do their work.
			
			Parameters:
				ready - promise that will be resolved when the context has been wired, rejected
					if there is an error during the wiring process, and will receive progress
					events for object creation, property setting, and initialization.
				destroy - promise that will be resolved when the context has been destroyed,
					rejected if there is an error while destroying the context, and will
					receive progress events for objects being destroyed.
		*/
		wire$wire: function(ready, destroy) {
			console.log(time("Context init"));
			
			ready.then(
				function onContextReady(context) {
					console.log(time("Context ready"), context);
				},
				function onContextError(err) {
					console.log(time("Context ERROR: "), err);
				},
				logProgress
			);
			
			destroy.then(
				function onContextDestroyed() {
					// Do any context-specific plugin cleanup here
					console.log(time("Context destroyed"));
				},
				function onContextDestroyError(err) {
					// Do any object-specific plugin cleanup here
					console.log(time("Context destroy ERROR"), err);
				},
				logProgress
			);
		}
	};
	
});