/*
	File: dijit.js
	wire dijit plugin that provides a dijit! resolver, setter, and
	manages the lifecycle of dijits created using wire ("programmatic"
	dijits, not dojoType/data-dojo-type dijits).
*/
/**
 * @license Copyright (c) 2010 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */
define(['dojo', 'dojo/parser'], function(dojo, parser) {
	var parsed = false;
	
	return {
		wire$resolvers: {
			/*
				Function: dijit
				Resolver for dijits by id.
				
				Parameters:
					factory - wire factory
					name - id of the dijit
					refObj - the complete $ref object
					promise - promise to resolve with the found dijit
			*/
			dijit: function(factory, name, refObj, promise) {
				dojo.ready(
					function() {
						var resolved = dijit.byId(name);
						if(resolved) {
							promise.resolve(resolved);
						} else {
							promise.unresolved();
						}
					}
				);
			}
		},
		wire$setters: [
			function setDijitProperty(object, property, value) {
				if(typeof object.set == 'function') {
					object.set(property, value);
					return true;
				}

				return false;
			}
		],
		wire$wire: function onWire(ready, destroy) {
			// Only ever parse the page once, even if other child
			// contexts are created with this plugin present.
			if(!parsed) {
				parsed = true;
				dojo.ready(function() { parser.parse(); });
			}

			destroy.then(null, null,
				function onObjectDestroyed(progress) {
					if( typeof progress.target.declaredClass == 'string') {
						var object = progress.target;

						// Prefer destroyRecursive over destroy
						if(typeof object.destroyRecursive == 'function') {
							object.destroyRecursive();

						} else if(typeof object.destroy == 'function') {
							object.destroy();

						}
					}
				}
			);
		}
	};
});