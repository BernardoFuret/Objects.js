/**
 * Wiki Gallery Objects namespace.
 * @external StringBuilder
 */
( factory => {
	"use strict";

	// CommonJS & Node.js:
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// Dependencies:
		const { StringBuilder } = require( "../StringBuilder/StringBuilder" );

		// Apply to the «exports» object:
		factory( exports, StringBuilder );
	}

	// AMD:
	/*else if ( typeof define === "function" && define.amd ) {
		define( "WikiGalleryObjects", [ "StringBuilder" ], factory )
	}*/

	// Browser & Web Workers:
	else {
		// Apply to «window» or Web Workers' «self»:
		factory( self, self.StringBuilder );
	}

} )( (exports, StringBuilder) => {
"use strict";


/**
 * @class Filename
 */
class Filename {

	/**
	 * Filename constructor (define attrbutes).
	 */
	constructor( filename ) {
		// Explicitly initializing attributes to «null»:
		[
			this.name,   this.setCode,
			this.region, this.release,
			this.rarity, this.edition,
			this.alt,    this.extension
		] = new Array( 8 ).fill( null );

		// And this one to «false», since it's a Boolean:
		this.isProxy = false;

		// Save raw input:
		this.raw = filename;
	}

}


/**
 * @class GalleryFilename
 */
class GalleryFilename extends Filename {

	/**
	 * Filename constructor.
	 * @param {string} filename - The file name (by {{Card image name}}).
	 */
	constructor( filename = "" ) {

		// Call super class constructor:
		super( filename );

		// Split:
		const [ indexes, extension ] = filename.split( "." );
		const parts = indexes.split( "-" );

		// Card image name:
		this.name = parts.shift();

		// File set code:
		this.setCode = parts.shift();
		
		// Region code:
		this.region = parts.shift();

		// Release code:
		let match = /-(OP|GC|CT|RP)[-.]/i.exec( filename );
		this.release = match ? match[ 1 ] : null; // TODO: this assumes the alt can't be one of these.

		// Remove it from the array:
		if ( this.release ) {
			parts.splice( parts.indexOf( this.release ), 1 );
		}

		// Flag if it's a Proxy:
		this.isProxy = this.release === "OP";

		// Next item:
		const next = parts.shift();

		// If the file is an Official Proxy:
		if ( this.isProxy ) {
			// Set the rarity code: (null, because OPs do not list a rarity)
			this.rarity = null;

			// Set the edition code:
			this.edition = next;
		} else {
			// Set the rarity as the next item:
			this.rarity = next;

			// Set the edition code:
			this.edition = parts.shift();
		}

		// Set the alt:
		this.alt = parts.shift();

		// Account for JP DT cases:
		if ( this.region === "JP" && this.edition !== "DT" ) {
			// No edition, but its previous value is the alt:
			[ this.edition, this.alt ] = [ null, this.edition ];
		}

		// Set the extension:
		this.extension = extension;

	}

}


/**
 * @class Caption
 */
class Caption {

	/**
	 * Caption constructor (define attrbutes).
	 */
	constructor( caption ) {
		// Explicitly initializing attributes to «null»:
		[
			this.number,  this.setCode,
			this.rarity,  this.release,
			this.edition, this.set,
			this.description,
		] = new Array( 7 ).fill( null );

		// Save raw input:
		this.raw = caption;
	}

}


/**
 * @class CardGalleryCaption
 */
class CardGalleryCaption extends Caption {

	/**
	 * Caption constructor.
	 * @param {string} caption - The image caption.
	 */
	constructor( caption = "" ) {

		// Call super class constructor:
		super( caption );

		// Split by linebreak HTML/XML tag:
		const parts = caption.split( /< *\/? *br *\/? *>/ );

		// Next item:
		let next = parts.shift();

		// Regex matches:
		let match;

		// Check for set code:
		if ( match = /^\[\[((.*?)-(.*?))\]\]/m.exec( next ) ) {
			// Set the card number
			this.number = match[ 1 ];

			// Set the set code:
			this.setCode = match[ 2 ];
		}

		// Check for the rairity code:
		if ( match = /\(\[\[(.*?)\]\]\)/.exec( next ) ) {
			// Set the rarity code:
			this.rarity = match[ 1 ];
		}

		// Next item:
		next = parts.shift();

		// Check for a release:
		if (
			/Proxy|Giant|Topper|Replica/.test( next )
			&&
			(match = /\(\[\[(.*?)\]\]\)/i.exec( next ))
		) {
			// Set the release:
			this.release = match[ 1 ];

			// Got a release, so update the next:
			next = parts.shift();
		}

		// Check for an edition:
		if ( match = /\(\[\[((.*?) Edition)\]\]\)/i.exec( next ) ) {
			// Set the card number
			this.edition = match[ 1 ];

			// Got an edition, so update the next:
			next = parts.shift();
		}

		// Check for a set name:
		if ( match = /^\[\[(.*?)\]\]/m.exec( next ) ) {
			// Set the set name:
			[ this.set ] = match[ 1 ].split( / *\| */ );
		}

		// Set a description: (should be the last item, if it still has one at this point)
		this.description = parts.shift();

	}

}


/**
 * @class SetGalleryCaption
 */
class SetGalleryCaption extends Caption {

	constructor() {
		// TODO
	}
}


/**
 * @class EntryOptions
 */
class EntryOptions {

	/**
	 * Entry options constructor.
	 */
	constructor() {
		// Options Map:
		this.map = new Map();
	}

	/**
	 * Given a «key» and a «value», adds the pair key=>value to the Map.
	 * @param {string} key - The pair key (should be a string; can't be «null»!).
	 * @param {string} value - The pair value (should be a string; can't be «null»!).
	 */
	add( key = null, value = null ) {
		// Check if either are null:
		if ( key !== null && value !== null ) {
			this.map.set( key, value );
		}

		// Allow method chaining:
		return this;
	}

	/**
	 * Renders a string representation of the Map.
	 */
	toString() {
		// Output buffer (string builder):
		const builder = new StringBuilder();

		// Iterate over the Map entries:
		this.map.forEach( ( value, key ) => {
			// Append to the builder:
			builder
				// Add key (options parameter name):
				.add( key )
				// Flush option pair:
				.flush( "; " )
				// Add value (options parameter value):
				.add( value )
				// Flush name::value pair:
				.flush( "::" )
			;
		} );

		// Return the string representation of the builder:
		return builder.toString();
	}

}


/**
 * @class GalleryEntry
 */
class GalleryEntry {
	// TODO
}


/**
 * @class CardGalleryEntry
 */
class CardGalleryEntry /*extends GalleryEntry*/ {

	/**
	 * CardGalleryEntry constructor.
	 * @param {string} token - Card gallery raw input.
	 */
	constructor( token ) {
		// Separate the card image name and the image caption:
		const [ filename, ...caption ] = token.split( / *\| */ );

		// Store the filename:
		this.filename = new GalleryFilename( filename );

		// Store the caption:
		this.caption = new CardGalleryCaption( caption.join( "|" ) );

		// Entry options:
		this.options = new EntryOptions();
	}

	/**
	 * Get the filename.
	 * @returns {Filename} - The filename struct.
	 */
	getFilename() {
		return this.filename;
	}

	/**
	 * Get the caption.
	 * @returns {Caption} - The image caption struct.
	 */
	getCaption() {
		return this.caption;
	}

	/**
	 * Renders the input path for {{Card gallery}}.
	 * @returns {string} - The entry for {{Card gallery}}.
	 */
	toString() {
		// Output buffer (string builder):
		const builder = new StringBuilder();

		// Build options:
		this.options
			// Add extension:
			.add( "extension", this.filename.extension !== "png" ? this.filename.extension : null )
			// Add description:
			.add( "description", this.caption.description )
		;

		// Build:
		builder
			// Card number:
			.add( this.caption.number || this.filename.setCode )
			// Set name:
			.add( this.caption.set )
			// Rarity code:
			.add( this.filename.rarity )
			// Edition code:
			.add( this.filename.edition )
			// Alt:
			.add( this.filename.alt )
			// Flush:
			.flush( "; " )
			// Add release code:
			.add( this.filename.release )
			// Flush:
			.flush( " :: " )
			// Add options:
			.add( this.options.toString() || null )
			// Flush:
			.flush( " // " )
		;

		// Return string representation of the builder ({{Card gallery}} input entry):
		// (Since this is a template parameter entry, the equals sign needs to be escaped.)
		return builder.toString().replace( "=", "{{=}}" );
	}

}


/**
 * @class SetGalleryEntry
 */
class SetGalleryEntry extends GalleryEntry {

	constructor( token ) {
		// TODO
	}

}


/**
 * @exports CardGalleryEntry
 */
exports.CardGalleryEntry = CardGalleryEntry;

/**
 * @exports SetGalleryEntry
 */
exports.SetGalleryEntry = SetGalleryEntry;

} );