import { __ } from '@wordpress/i18n';
import CommonLayout from '../../../../../components/Layouts/Common';
import NewfoldLargeCard from '../../../../../components/NewfoldLargeCard';
import { VIEW_NAV_GET_STARTED } from '../../../../../../constants';
import { store as nfdOnboardingStore } from '../../../../../store';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import CardHeader from '../../../../../components/CardHeader';
import NavCardButton from '../../../../../components/Button/NavCardButton';
import NeedHelpTag from '../../../../../components/NeedHelpTag';
import content from '../content.json';
import { translations } from '../../../../../utils/locales/translations';


const StepSecondarySetup = () => {
	const { setDrawerActiveView, setIsSidebarOpened, setIsDrawerSuppressed } = useDispatch(
		nfdOnboardingStore
	);

	useEffect(() => {
		setIsSidebarOpened(false);
		setIsDrawerSuppressed(true);
		setDrawerActiveView(VIEW_NAV_GET_STARTED);
	}, []);

	const [isLoaded, setIsLoaded] = useState(false);
	const [primaryType, setPrimaryType] = useState('');
	const [clickedIndex, changeCategory] = useState(-1);
	const [inputCategVal, changeInputCateg] = useState('');
	const [categoriesArray, setCategoriesArray] = useState(content?.categories[0]);


	const { setCurrentOnboardingData } = useDispatch(nfdOnboardingStore);

	const { currentStep, currentData } = useSelect((select) => {
		return {
			currentStep: select(nfdOnboardingStore).getCurrentStep(),
			currentData: select(nfdOnboardingStore).getCurrentOnboardingData()
		};
	}, []);

	var selectedPrimaryCatInStoreIndex = content?.categoryNames[currentData?.data?.siteType?.primary] ?? 0;
	var categories = content?.categories[selectedPrimaryCatInStoreIndex];
	var selectedCategoryInStore = currentData?.data?.siteType?.secondary;
	var subCategories = categoriesArray?.subCategories;

	if(!isLoaded)
	{
		setPrimaryType(currentData?.data?.siteType?.primary);
		setCategoriesArray(categories);
		subCategories = categoriesArray?.subCategories;
		setIsLoaded(true);
	}

	/** This condition fills the data in input box if the saved category isn't a subcategory from the content*/
	if (selectedCategoryInStore && !inputCategVal && subCategories.indexOf(selectedCategoryInStore) === -1) {
		if (selectedCategoryInStore !== 'secondaryCategory'){
			changeInputCateg(selectedCategoryInStore);
	}

	/** Function which saves data in redux when category name is put-in via input box */
	const categoryInput = input => {
		changeCategory(-1);
		changeInputCateg(input?.target?.value);
		const currentDataCopy = currentData;
		currentDataCopy.data.siteType['primary'] = primaryType;
		currentDataCopy.data.siteType['secondary'] = input?.target?.value;
		setCurrentOnboardingData(currentDataCopy);
	}

	/** Function which saves data in redux when category name is chosen via categories displayed */
	const handleCategoryClick = (idxOfElm) => {
		changeCategory(idxOfElm);
		changeInputCateg('');
		const currentDataCopy = currentData;
		currentDataCopy.data.siteType['primary'] = primaryType;
		currentDataCopy.data.siteType['secondary'] = categoriesArray?.subCategories[idxOfElm];
		setCurrentOnboardingData(currentDataCopy);
	}

	const changedPrimaryPrev = () => {
		selectedPrimaryCatInStoreIndex -= 1;

		if (selectedPrimaryCatInStoreIndex == -1) 
			selectedPrimaryCatInStoreIndex = content?.categories.length - 1;

		setPrimaryType(content?.categories[selectedPrimaryCatInStoreIndex]?.name);
		setCategoriesArray(content?.categories[ selectedPrimaryCatInStoreIndex ]);
	}

	const changedPrimaryNext = () => {

		selectedPrimaryCatInStoreIndex += 1;
		if (selectedPrimaryCatInStoreIndex == content?.categories.length )
			selectedPrimaryCatInStoreIndex = 0;

		setPrimaryType(content?.categories[selectedPrimaryCatInStoreIndex]?.name);
		setCategoriesArray(content?.categories[ selectedPrimaryCatInStoreIndex ]);
	}

	return (
		<CommonLayout isBgPrimary isCentered>
			<NewfoldLargeCard className={'site-type-card'}>
				<div className="nfd-card-heading center">
					<CardHeader
						heading={__(currentStep?.heading, 'wp-module-onboarding')}
						subHeading={sprintf(__(content.subHeading, 'wp-module-onboarding'), translations('SITE'))}
						question={__(currentStep?.subheading, 'wp-module-onboarding')}
					/>
				</div>

				<div className='nfd-setup-secondary-categories'>
					<div className='nfd-card-category-wrapper'>
						<div className="category-scrolling-wrapper">
							<div className="category-scrolling-wrapper_left-btn">
								<span className="category-scrolling-wrapper_left-btn-icon" 
									onClick={changedPrimaryPrev}
									style={{ backgroundImage: "var(--chevron-left-icon)" }} />
							</div>
							<div className="category-scrolling-wrapper_type">
								<span className="icon" style={{ backgroundImage: categoriesArray.icon }} />
								<p className="categName"> {categoriesArray.name}</p>
							</div>
							<div className="category-scrolling-wrapper_right-btn">
								<span className="category-scrolling-wrapper_right-btn-icon"
									onClick={changedPrimaryNext}
									style={{ backgroundImage: "var(--chevron-right-icon)" }} />
							</div>
						</div>
					</div>

					<div className='subCategoriesSection'>
						{
							categoriesArray?.subCategories?.map((item, idx) => {
								return <span
									key={item}
									onClick={(e) => handleCategoryClick(idx)}
									className={`${(clickedIndex === idx || item === selectedCategoryInStore) ? 'chosenSecondaryCategory ' : ''}nfd-card-category`}>
									{item}
								</span>
							})
						}
					</div>
				</div>

				<div className='nfd-setup-primary-second'>
					<div className='nfd-setup-primary-second-top'>
						<p className='blackText'>{__(content.tellusHereText, 'wp-module-onboarding')}</p>
						<input
							type="text"
							onChange={(e) => categoryInput(e)}
							className='tellUsInput'
							placeholder={sprintf(__(content.placeholderSiteTypeInput, 'wp-module-onboarding'), translations('site'))}
							value={inputCategVal}
						/>
					</div>
					<div className='nfd-setup-primary-second-bottom'>
						<NavCardButton
							text={__(content.buttonText)}
						/>
						<NeedHelpTag />
					</div>
				</div>
				
			</NewfoldLargeCard>
		</CommonLayout>
	);
};

export default StepSecondarySetup;

