import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testShowAll = () => {
		const studiesBefore = [{id:0,name:"E the name",active:true,displayFlag:false},{id:1,name:"B the name",active:true,displayFlag:false},{id:2,name:"A the name",active:true,displayFlag:true}];
		const studiesAfter = [{id:0,name:"E the name",active:true,displayFlag:true},{id:1,name:"B the name",active:true,displayFlag:true},{id:2,name:"A the name",active:true,displayFlag:true}];
		// deepFreeze(studiesBefore);
		expect(
			setVisibility(studiesBefore, 'SHOW_ALL')
		).toEqual(studiesAfter);
		console.log('test show all passed');
};


export const visibilityTests = { testShowAll };