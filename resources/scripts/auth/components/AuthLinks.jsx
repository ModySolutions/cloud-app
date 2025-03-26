import { navigate } from '@modycloud/auth/AuthContext';

const AuthLinks = ( {
	leftLink = '',
	leftText = '',
	rightLink = '',
	rightText = '',
} ) => {
	return (
		<div className="flex flex-row justify-space-between mb-3 p-1">
			{ leftLink && leftText && (
				<div className="col">
					<a href={ leftLink } onClick={ navigate }>
						{ leftText }
					</a>
				</div>
			) }
			{ rightLink && rightText && (
				<div className="col">
					<a href={ rightLink } onClick={ navigate }>
						{ rightText }
					</a>
				</div>
			) }
		</div>
	);
};

export default AuthLinks;
