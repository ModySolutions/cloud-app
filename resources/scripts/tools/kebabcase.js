export default function toKebabCase( str ) {
	return str
		.toString()
		.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )
		.replace( /\s+/g, '-' )
		.toLowerCase();
}
