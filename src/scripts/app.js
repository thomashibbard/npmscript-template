// import "babel-polyfill";

import { createStore } from 'redux';
import $ from 'jquery';
import _ from 'lodash';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

// import studyApp from './study-app';
// import { visibilityTests } from './test/study-tests';



$(function(){

	const studyState = {
		sortOrder: 'SORT_AZ',
		studies: [
			{
				id: 0,
				name: 'E the name',
				active: true,
				displayFlag: true
			},
			{
				id: 1,
				name: 'B the name',
				active: true,
				displayFlag: true
			},
			{
				id: 2,
				name: 'A the name',
				active: true,
				displayFlag: true
			},
			{
				id: 3,
				name: 'C the name',
				active: false,
				displayFlag: false
			},
			{
				id: 4,
				name: 'Z the name',
				active: true,
				displayFlag: true
			},
			{
				id: 5,
				name: 'D the name',
				active: false,
				displayFlag: false
			}
		]
	};
	studyState.studies.sort((a, b) => {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	console.log(studyState);
	/*	{
			id: 0,
			name: 'E the name',
			active: true,
			show: false,
			displayFlag: true
		}
	*/

	const setVisibility = (studies, flag) => {
		let filters = {
			SHOW_ALL () {
				return studies.map(study => {
					return {
					  ...study,
					  displayFlag: true
					}
				});
			},
			SHOW_ACTIVE () {
			  return studies.map(study => {
			    return {
					  ...study,
			      displayFlag: study.active === true ? true : false
			    };
			  });
			},
			SHOW_INACTIVE () {
				return studies.map(study => {
					return {
					  ...study,
						displayFlag: study.active === false ? true : false
					};
				});
			},
		};
		return filters[flag]();
	};

	const sortStudies = (studies, sortOrder) => {
		let compareFns = {
			SORT_AZ () {
				// return [{id:2,name:"A the name",active:true,displayFlag:true},{id:1,name:"B the name",active:false,displayFlag:false},{id:0,name:"E the name",active:false,displayFlag:false}];
				var temp = studies.slice();
				return [...studies].sort((a, b) => {
					return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
				})
			},
			SORT_ZA () {
				return [...studies].sort((a, b) => {
					return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
				})
			}
		};
		return compareFns[sortOrder]();
	}


	//manages all state updates
	const studyReducer = (state = studyState, action) => {
		switch (action.type) {
			case 'SET_VISIBILITY_FILTER':
				return {
					...state,
					studies: setVisibility(state.studies, action.filter)
				};
				break;
			case 'SET_SORT_ORDER':
				return {
					...state,
					sortOrder: action.sortOrder,
					studies: sortStudies(state.studies, action.sortOrder)
				}
			default:
				return state;
		}
	};

	const store = createStore(studyReducer);

	const getVisibilityFilter = (type) => {
		let types = {
			'all': 'SHOW_ALL',
			'active': 'SHOW_ACTIVE',
			'inactive': 'SHOW_INACTIVE',
			'default': 'SHOW_ALL',
		};
		return types[type] || types.default;
	};

	const getSortOrder = (order) => {
		let orders = {
			'az': 'SORT_AZ',
			'za': 'SORT_ZA',
			'default': 'SORT_AZ'
		};
		return orders[order] || orders.default;
	}



	$('body').on('change', '.audience-filter__option', e => {
		let $this = $(e.currentTarget)
			, filter = getVisibilityFilter($this.val());
		store.dispatch({
	  	filter: filter,
	  	type: 'SET_VISIBILITY_FILTER',
		})
	});

	$('body').on('change', '.audience-sort__options', e => {
		let $this = $(e.currentTarget)
			, sortOrder = getSortOrder($this.val());
			store.dispatch({
				sortOrder: sortOrder,
				type: 'SET_SORT_ORDER'
			})
	});



	const renderPostCards = () => {
		console.log('subscribe callback', JSON.stringify(store.getState().studies, false, 2));
		let template = $('#tmpl').html();
		let compiled = _.template(template);
		let rendered = compiled({data: store.getState()});
		$('#hook').html(rendered);
	};

	store.subscribe(renderPostCards);
	renderPostCards();






















	const testShowAll = () => {
			console.log('testShowAll...');
			const studiesBefore = [{id:0,name:"E the name",active:true,displayFlag:false},{id:1,name:"B the name",active:true,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true}];
			const studiesAfter =  [{id:0,name:"E the name",active:true,displayFlag:true},{id:1,name:"B the name",active:true,displayFlag:true},{id:2,name:"A the name",active:true,displayFlag:true}];
			deepFreeze(studiesBefore);
			expect(
				setVisibility(studiesBefore, 'SHOW_ALL')
			).toEqual(studiesAfter);
			console.log('testShowAll passed');
	};

	const testShowActive = () => {
		console.log('testShowActive...');
		const studiesBefore = [{id:0,name:"E the name",active:true,displayFlag:false},{id:1,name:"B the name",active:true,displayFlag:false},{id:2,name:"A the name",active:false,displayFlag:true}];
		const studiesAfter =  [{id:0,name:"E the name",active:true,displayFlag:true},{id:1,name:"B the name",active:true,displayFlag:true},{id:2,name:"A the name",active:false,displayFlag:false}];
		deepFreeze(studiesBefore);

		expect(
			setVisibility(studiesBefore, 'SHOW_ACTIVE')
		)
		.toEqual(studiesAfter);
		console.log('testShowActive passed');
	};
	const testShowInactive = () => {
		console.log('testShowInactive...');
		const studiesBefore = [{id:0,name:"E the name",active:false,displayFlag:false},{id:1,name:"B the name",active:false,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true}];
		const studiesAfter =  [{id:0,name:"E the name",active:false,displayFlag:true},{id:1,name:"B the name",active:false,displayFlag:true},{id:2,name:"A the name",active:true,displayFlag:false}];
		deepFreeze(studiesBefore);

		expect(
			setVisibility(studiesBefore, 'SHOW_INACTIVE')
		)
		.toEqual(studiesAfter);
		console.log('testShowInactive passed');
	};
	const testSortAZ = () => {
		console.log('testSortAZ...');
		const studiesBefore = [{id:0,name:"E the name",active:false,displayFlag:false},{id:1,name:"B the name",active:false,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true}];
		const studiesAfter =  [{id:2,name:"A the name",active:true,displayFlag:true},{id:1,name:"B the name",active:false,displayFlag:false},{id:0,name:"E the name",active:false,displayFlag:false}];
		deepFreeze(studiesBefore);

		expect(
			sortStudies(studiesBefore, 'SORT_AZ')
		)
		.toEqual(studiesAfter);
		console.log('testSortAZ passed');

	}
	const testSortZA = () => {
		console.log('testSortZA...');
		const studiesBefore = [{id:0,name:"E the name",active:false,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true},{id:1,name:"B the name",active:false,displayFlag:false}];
		const studiesAfter =  [{id:0,name:"E the name",active:false,displayFlag:false},{id:1,name:"B the name",active:false,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true}];
		deepFreeze(studiesBefore);

		expect(
			sortStudies(studiesBefore, 'SORT_ZA')
		)
		.toEqual(studiesAfter)
		console.log('testSortZA passed');
	}

	testShowAll();
	testShowActive();
	testShowInactive();
	testSortAZ();
	testSortZA();

	// console.log('testShowAll passed');







});