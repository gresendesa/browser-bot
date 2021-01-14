class UI {


	/*
		This state represents all the current state of the UI
		Attributes and values should be assigned here
	*/

	state = {
		fields: {
			text: {},
			boolean: {},
			option: {},
			radio: {}
		},
		freezed: false
	}

	static get CONSTANTS() {
		return {
			'UI_STATE': 'ui-state'
		}
	}


	/*
		This constructor sets all the listeners for ui components
		As well it assigns propper values to its components
		Fist of all it requires background script to get values on memory
	*/

	constructor() {
			

		const handleEvents = (request, sender, sendResponse) => {

			if(request.context === 'ui'){
				if(request.subject === 'bot-reset'){
					let state = {
						freezed: false
					}
					let callback = response => {
						this.freeze(false)
						sendResponse({ subject: 'response', item: 'received' })
					}
					this.updateState({ state, callback })
				} else 
				if(request.subject === 'update-state'){
					this.updateState({
						state: request.data,
						callback: () => {
							sendResponse({ subject: 'response', item: 'updated' })
							this.renderFields()
						}
					})
					
				}
			}

			return true
		}

		const bootstrap = () => {

			console.log('bootstrap', this.state)
			let orders = document.getElementsByClassName('ui-order')
			Array.prototype.forEach.call(orders, (elem) => {
				elem.addEventListener('click', this.activateOrderTrigger)
			})

			this.renderFields((elem) => {
				elem.addEventListener('change', this.onFieldChange)
			})
			
			const sendLoadMessage = tabs => {
				let message = {
					context: 'content',
					subject: 'event',
					item: 'loaded'
				}
				chrome.tabs.sendMessage(tabs[0].id, message)
			}

			let queryInfo = {
				active: true,
				currentWindow: true
			}

			chrome.tabs.query(queryInfo, sendLoadMessage)
		} 

		const callback = (state) => {
			if(state){
				this.state = state
				bootstrap(this.state)
			} else {
				this.updateState({ state: this.state, callback: bootstrap })
			}
		}

		//Receive messages from background-script and content script
		chrome.runtime.onMessage.addListener(handleEvents)

		this.fetchState({ callback })

	}

	/*
		It update values of all the UI fields based on the current state
		It accepts a hook which receives each element
		to do whatever the programmer wants
	*/
	renderFields = hook => {
		console.log('rendering...')
		let fields = document.getElementsByClassName('ui-field')
		Array.prototype.forEach.call(fields, elem => {

			const assignValue = (element, attr, value) => {
				if(value){
					elem[attr] = value
					return true
				}
				return false
			}

			let elemClass = elem.className

			if(elemClass.includes('ui-container-text')){
				 if(!assignValue(elem, 'value', this.state.fields.text[elem.name])){
				 	this.state.fields.text[elem.name] = elem.value
				 }
			} else 
			if(elemClass.includes('ui-container-boolean')){
				if(!assignValue(elem, 'checked', this.state.fields.boolean[elem.name])){
					this.state.fields.boolean[elem.name] = elem.checked
				}
			} else
			if(elemClass.includes('ui-container-option')){
				if(!assignValue(elem, 'value', this.state.fields.option[elem.name])){
					this.state.fields.option[elem.name] = elem.value
				}
			} else 
			if(elemClass.includes('ui-container-radio')){
				if(this.state.fields.radio[elem.name]==elem.value){
					assignValue(elem, 'checked', true)
				} else 
				if((elem.checked) && (!this.state.fields.radio[elem.name])){
					this.state.fields.radio[elem.name] = elem.value
				}
				
			}
			if(this.state.freezed){
				this.freeze(true)
			}
			if(typeof hook === 'function'){
				hook(elem)
			}
		})
	}

	/*
		It disables/enables all the fields with iu class
	*/
	freeze(yesOrNo){
		let uis = document.getElementsByClassName('ui')
		Array.prototype.forEach.call(uis, (elem) => {
			elem.disabled = yesOrNo
		})
	}

	/*
		This funtion handles orders raised by click events
		It sends a message to the current tab especifying order and bot state snapshot
		It ensures message is received by the endpoint. To do that, it sends 
		repeatedly messages not received
	*/
	activateOrderTrigger = (e) => {
		let queryInfo = {
			active: true,
			currentWindow: true
		}
		const message = {
			context: 'content',
			subject: 'order',
			item: e.target.name,
			data: this.state
		}
		const sendClickMessage = (tabs) => {
			console.log('sending', message, 'to', tabs[0].id, queryInfo)
			chrome.tabs.sendMessage(tabs[0].id, message, (message) => {
				console.info('click response', message)
				if(message === undefined){
					console.info('ENDING DID NOT RESPOND. Sending order again!')
					chrome.tabs.query(queryInfo, sendClickMessage)
				} else {
					let state = {
						freezed: true
					}
					let callback = response => {
						this.freeze(true)
					}
					this.updateState({ state, callback })
				}
			})
		}

		chrome.tabs.query(queryInfo, sendClickMessage)
	}

	/*
		It get state from background script and it passed the data to callback argument
	*/
	fetchState({ callback }) {
		//console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		console.log('fetching state')
		const request = { context: "background", subject: "get", item: UI.CONSTANTS['UI_STATE'], data: null }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	/*
		It updates the state both the on background script and on the object itself
	*/
	updateState({ state, callback, replace = false }){
		//console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		if(state){
			let before = {...this.state }
			if(replace){
				this.state = state
			} else {
				this.state = Deep.merge({...this.state}, {...state})
			}
			console.log(before, '+', state, '=', this.state, 'replace', replace)
		}
		const request = { context: "background", subject: "set", item: UI.CONSTANTS['UI_STATE'], data: {...this.state} }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	/*
		It updates a field from state
		It updates the state both the on background script and on the object itself
	*/
	updateField({ type, name, value, callback }) {
		this.state.fields[type][name] = value
		const request = { context: "background", subject: "set", item: UI.CONSTANTS['UI_STATE'], data: {...this.state} }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	/*
		It handles changes on the UI elements from DOM based on their classes
	*/
	onFieldChange = (event) => {

		const target = event.target

		if(target.className.includes('ui-container-text')){
			this.updateField({ type: 'text', name: target.name, value: target.value })
		} else 
		if(target.className.includes('ui-container-boolean')){
			this.updateField({ type: 'boolean', name: target.name, value: target.checked })
		} else
		if(target.className.includes('ui-container-option')){
			this.updateField({ type: 'option', name: target.name, value: target.value })
		} else
		if(target.className.includes('ui-container-radio')){
			this.updateField({ type: 'radio', name: target.name, value: target.value })
		}
	}

}