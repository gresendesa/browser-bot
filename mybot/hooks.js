/*

	These functions will be passed on hooks for jSpaghetti sequences (second paramenter)
	Do not define function with 'next' or 'getObjectSnapshot' names. They are reserved

*/

class Util {

	constructor(){

	}

	/*
		Dummy function for testing
	*/
	sayHello = function(){
		console.log('saying hello')
	}

	/*
		Pass a state to be assigned to UI state
		callback will be called after state is updated
	*/
	updateUI = function({ state, callback }) {
		const request = new Message({ context: "ui", subject: "update-state", data: state })
		Browser.sendMessage(request, (response) => {
			if(typeof callback === 'function'){
				callback(response)
			}
		})
	}

	/*
		type can be 'text', 'boolean', 'option', or 'radio'
		name should receive the name field name specified on HTML
		value is the value itself which will be bind ^.^
		callback will be called after state is updated
	*/
	updateUIField = ({ type, name, value, callback }) => {
		let state = {}
		state['fields'] = {}
		state['fields'][type] = {} 
		state['fields'][type][name] = value
		this.updateUI({
			state,
			callback
		})
	}


	/*
	
		https://getbootstrap.com/docs/4.0/utilities/colors/
		show messages in UI

	*/
	showMessage = ({ message, level='light' }) => {
		UI.showMessage(message, level)
	}

}