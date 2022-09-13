import CommonLayout from '../../../components/Layouts/Common';
import { VIEW_DESIGN_THEME_STYLES } from '../../../../constants';
import { store as nfdOnboardingStore } from '../../../store';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import LivePreview from '../../../components/LivePreview';

import { check, search, Icon } from '@wordpress/icons';
import { useNavigate } from 'react-router-dom';
import { useViewportMatch } from '@wordpress/compose';
import { getPatterns } from '../../../utils/api/patterns';
import { getGlobalStyles } from '../../../utils/api/themes';

import HeadingWithSubHeading from '../../../components/HeadingWithSubHeading';

const StepDesignThemeStyle = () => {
	const MAX_PREVIEWS_PER_ROW = 3;

	const navigate = useNavigate();
	const [ isLoaded, setIsLoaded ] = useState( false );
	const [ pattern, setPattern ] = useState();
	const [ globalStyles, setGlobalStyles ] = useState();
	const [ selectedStyle, setSelectedStyle ] = useState( 0 );

	const isLargeViewport = useViewportMatch( 'medium' );
	const { currentStep, nextStep } = useSelect( ( select ) => {
		return {
			currentStep: select( nfdOnboardingStore ).getCurrentStep(),
			nextStep: select( nfdOnboardingStore ).getNextStep(),
		};
	}, [] );

	const {
		setDrawerActiveView,
		setIsDrawerOpened,
		setIsSidebarOpened,
		setIsDrawerSuppressed,
	} = useDispatch( nfdOnboardingStore );

	useEffect( () => {
		if ( isLargeViewport ) {
			setIsDrawerOpened( true );
		}
		setIsSidebarOpened( false );
		setIsDrawerSuppressed( false );
		setDrawerActiveView( VIEW_DESIGN_THEME_STYLES );
	}, [] );

	const getStylesAndPatterns = async () => {
		const pattern = await getPatterns( 'theme-styles', true );
		const globalStyles = await getGlobalStyles();
		setPattern( pattern?.body );
		setGlobalStyles( globalStyles?.body );
		setIsLoaded( true );
	};

	useEffect( () => {
		if ( ! isLoaded ) getStylesAndPatterns();
	}, [ isLoaded ] );

	const handleClick = ( idx ) => {
		setSelectedStyle( idx );
		navigate( nextStep.path );
	};

	const buildPreviews = ( start ) => {
		const previews = [];
		globalStyles?.forEach( ( globalStyle, idx ) => {
			previews.push(
				<div
					className="theme-styles-preview__list__item"
					onClick={ () => handleClick( idx ) }
				>
					<div className="theme-styles-preview__list__item__title-bar">
						<div className="theme-styles-preview__list__title-bar__browser">
							<span
								className="theme-styles-preview__list__item__title-bar__browser__dot"
								style={ { background: '#989EA7' } }
							></span>
							<span
								className="theme-styles-preview__list__item__title-bar__browser__dot"
								style={ { background: '#989EA7' } }
							></span>
							<span
								className="theme-styles-preview__list__item__title-bar__browser__dot"
								style={ { background: '#989EA7' } }
							></span>
						</div>
						<div
							className={ `${
								idx == selectedStyle
									? 'theme-styles-preview__list__item__title-bar--selected'
									: 'theme-styles-preview__list__item__title-bar--unselected'
							}` }
						>
							<Icon
								className="theme-styles-preview__list__item__title-bar--selected__path"
								icon={ check }
								size={ 64 }
							/>
						</div>
					</div>
					<div className="theme-styles-preview__list__item__live-preview-container">
						<LivePreview
							blockGrammer={ pattern }
							viewportWidth={ 900 }
							styling={ 'custom' }
							previewSettings={ globalStyle }
						/>
						<div className="theme-styles-preview__list__item__live-preview-container__overlay">
							<Icon
								className="theme-styles-preview__list__item__live-preview-container__overlay__icon"
								size={ 64 }
								icon={ search }
							/>
						</div>
					</div>
				</div>
			);
		} );

		return previews;
	};

	return (
		<CommonLayout>
			<div className="theme-styles-preview">
				<HeadingWithSubHeading
					title={ currentStep?.heading }
					subtitle={ currentStep?.subheading }
				/>
				<div className="theme-styles-preview__list">
					{ globalStyles ? buildPreviews().slice( 0, MAX_PREVIEWS_PER_ROW ) : '' }
				</div>
				<div className="theme-styles-preview__list">
					{ globalStyles
						? buildPreviews().slice( MAX_PREVIEWS_PER_ROW, globalStyles.length )
						: '' }
				</div>
			</div>
		</CommonLayout>
	);
};

export default StepDesignThemeStyle;
