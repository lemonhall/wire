/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/on plugin
 * wire plugin that provides an "on" facet that uses dojo/on (dojo 1.7
 * and later) to connect to dom events, and includes support for delegation
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(['../plugin-base/on', 'dojo/on', 'dojo/query'], function(createOnPlugin, dojoOn) {

	/**
	 *
	 * @param node {HTMLElement} should this be a Node?
	 * @param event {String} event name ('click', mouseenter')
	 *   TODO: support multiple events and selectors
	 * @param handler {Function} function (e) {}
	 * @param [selector] {String} optional css query string to use to
	 */
	function on (node, event, handler /*, selector */) {
		var selector;

		selector = arguments[3];

		if (selector) {
			event = dojoOn.selector(selector, event);
		}

		return dojoOn(node, event, handler).remove;
	}

	on.wire$plugin = createOnPlugin({
		on: on
	}).wire$plugin;

	return on;

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (deps, factory) { module.exports = factory.apply(this, deps.map(require)); }
));
