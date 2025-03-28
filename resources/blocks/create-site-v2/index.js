import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="20px"
			viewBox="0 -960 960 960"
			width="20px"
			fill="#666666"
		>
			<path d="M744-202v-86h-48v106l79 79 34-34-65-65ZM481-792 245-657l235 135 235-135-234-135ZM144-320v-320q0-19.77 9.45-35.94Q162.9-692.12 180-702l262.62-152.27Q452-859 460.82-862q8.82-3 19.04-3 10.21 0 19.5 3 9.28 3 17.64 8l263 152q17.1 9.88 26.55 26.06Q816-659.77 816-640v184h-72v-135L479-439 216-591v270l240 139v83L180-258q-17-9-26.5-25.45T144-320ZM719.77 0Q640 0 584-56.23q-56-56.22-56-136Q528-272 584.23-328q56.22-56 136-56Q800-384 856-327.77q56 56.22 56 136Q912-112 855.77-56q-56.22 56-136 56ZM480-487Z" />
		</svg>
	),
	edit: Edit,
	save,
} );
