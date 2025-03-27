import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
	return (
		<p { ...useBlockProps.save() }>{ 'Account Module for Mody Cloud' }</p>
	);
}
