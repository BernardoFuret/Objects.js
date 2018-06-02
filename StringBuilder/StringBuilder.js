/**
 * StringBuilder namespace.
 */
( factory => {
	"use strict";

	// CommonJS & Node.js:
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// Apply to the «exports» object:
		factory( exports );
	}

	// AMD:
	/*else if ( typeof define === "function" && define.amd ) {
		define( "StringBuilder", [], factory )
	}*/

	// Browser & Web Workers:
	else {
		// Apply to «window» or Web Workers' «self»:
		factory( self );
	}

} )( exports => {
"use strict";

/**
 * @class StringBuilder
 */
class StringBuilder {

	/**
	 * StringBuilder constructor.
	 */
	constructor() {
		// Initialize buffer:
		this.buffer = [];
	}

	/**
	 * Add to the buffer.
	 * @param {*} token - Token to append to the buffer to be flushed.
	 */
	add( token = null ) {

		// Add token to the buffer, if it exists: (not «null» nor empty string)
		if ( token !== null && token !== "" ) {
			this.buffer.push( token );
		}

		// Allow method chaining:
		return this;

	}

	/**
	 * Flush buffer contents to meta buffer.
	 * @param {string} delimiter - Delimiter used to join the buffer content.
	 */
	flush( delimiter = "" ) {

		// Check if there's actually content to flush:
		if ( this.buffer.length > 0 ) {
			// Join everything:
			const join = this.buffer.join( delimiter );

			// Clean the buffer:
			this.buffer.length = 0;

			// Push the joined content to the buffer:
			this.buffer.push( join );
		}

		// Allow method chaining:
		return this;

	}

	/**
	 * Render instance to string.
	 * @return {string} - String representation of the buffer.
	 */
	toString() {
		// Flush everything, just in case:
		this.flush( "" );

		// Return string representation of the buffer content:
		return this.buffer.join( "" );
	}

}

/**
 * @exports StringBuilder
 */
exports.StringBuilder = StringBuilder;

} );
