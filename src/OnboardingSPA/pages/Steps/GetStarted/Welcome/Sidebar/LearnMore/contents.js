import { __, sprintf } from '@wordpress/i18n';

import { translations } from '../../../../../../utils/locales/translations';

const contents = ( brandName ) => {
	return {
		headingWithDescriptions: [
			{
				heading: sprintf(
					/* translators: %s: Website */
					__(
						'WordPress is free %s software',
						'wp-module-onboarding'
					),
					translations( 'website' )
				),
				description: sprintf(
					/* translators: 1: Website 2: Website 3: Website */
					__(
						`When you set up this new WordPress %s, you’re joining
					millions of other %s owners who publish their %s’s pages
					and features using the community-built, free, open-source
					software.`,
						'wp-module-onboarding'
					),
					translations( 'website' ),
					translations( 'website' ),
					translations( 'website' )
				),
			},
			{
				heading: sprintf(
					/* translators: 1: Website 2: Brand */
					__( '%s is your %s partner', 'wp-module-onboarding' ),
					brandName,
					translations( 'website' )
				),
				description: sprintf(
					/* translators: 1: Website 2: Brand */
					__(
						`A WordPress %s hosted by %s has tons of exclusive, easy
					and powerful solutions and addons to help you get farther,
					faster with your WordPress -- we put our expertise, partnerships
					and solutions to work for you.`,
						'wp-module-onboarding'
					),
					translations( 'website' ),
					brandName
				),
			},
		],
		experts: {
			text: __(
				'1-1 Expert Solutions & Coaching',
				'wp-module-onboarding'
			),
		},
		fullService: {
			text: __(
				'Hire Our Full-Service Creative Team',
				'wp-module-onboarding'
			),
		},
		support: {
			text: __( 'Technical Support', 'wp-module-onboarding' ),
		},
	};
};

export default contents;
