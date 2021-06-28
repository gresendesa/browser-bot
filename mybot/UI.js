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

	filters = {
		fields: {
			text: {},
			boolean: {},
			option: {},
			radio: {}
		}
	}

	static get CONSTANTS() {
		return {
			'UI_STATE': 'ui-state',
			'PRINT_LEVELS': {
				'primary': { bg: 'bg-primary', text: 'text-white' },
				'secondary': { bg: 'bg-secondary', text: 'text-white' },
				'success': { bg: 'bg-success', text: 'text-white' },
				'danger': { bg: 'bg-danger', text: 'text-white' },
				'warning': { bg: 'bg-warning', text: 'text-dark' },
				'info': { bg: 'bg-info', text: 'text-white' },
				'light': { bg: 'bg-light', text: 'text-dark' },
				'dark': { bg: 'bg-dark', text: 'text-white' },
				'white': { bg: 'bg-white', text: 'text-dark' }
			}
		}
	}


	/*
		This constructor sets all the listeners for ui components
		As well it assigns propper values to its components
		Fist of all it requires background script to get values on memory
	*/

	constructor({ filters }) {
			

		this.filters = Deep.merge(this.filters,filters)

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
				} else 
				if(request.subject === 'onthefly-output'){
					this.printMessage(request.data.value, request.data.classes)
					sendResponse({ subject: 'response', item: 'output written' })
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
			Array.prototype.forEach.call(orders, (elem) => {
				elem.addEventListener('contextmenu', this.activateOrderTrigger)
			})

			this.renderFields((elem) => {
				elem.addEventListener('change', this.onFieldChange)
			})
			
			const sendLoadMessage = tabs => {
				let message = new Message({
					context: 'content',
					subject: 'event',
					item: 'loaded'
				})
				Browser.sendMessageToTab(tabs[0].id, message)
			}

			let queryInfo = {
				active: true,
				currentWindow: true
			}

			Browser.queryTabs(queryInfo, sendLoadMessage)
		} 

		const updateUIFreeze = () => {
			//console.log('opa, currentSequence', currentSequence)
			this.getBotCurrentSequence({ 
				callback: currentSequence => {
					let state = {
						freezed: ((currentSequence) ? true : false)
					}
					this.updateState({
						state,
						callback: bootstrap
					})
				} 
			})
		}

		const callback = (state) => {
			if(state){
				this.state = state
				updateUIFreeze()
			} else {
				this.updateState({ state: this.state, callback: updateUIFreeze })
			}
		}

		//Receive messages from background-script and content script
		Browser.listenToMessages(handleEvents)
		this.fetchState({ callback })

	}

	/*
		Prints a message using the bootstrap classes defined on CONSTANTS['PRINT_LEVEL']
	*/
	printMessage(message, classes) {
		const container = document.getElementById('onthefly-output')
		container.className = container.className.replace(/\bbg-\S+\b/, classes.bg)
		container.className = container.className.replace(/\btext-\S+\b/, classes.text)
		container.innerHTML = message
	}


	/*
		This method is supposed to be used to others scopes
		It sends a message to UI itself in order to print the message
		Use printMessage() if you want to print from object itself
	*/
	static showMessage(content, level='light') {

		//scheme from https://getbootstrap.com/docs/4.0/utilities/colors/
		const levels = UI.CONSTANTS['PRINT_LEVELS']

		const message = new Message({
			context: "ui", 
			subject: "onthefly-output", 
			data: { value: content, classes: ((typeof levels[level] === 'undefined') ? levels['light'] : levels[level]) }
		})

		Browser.sendMessage(message, (response) => {
			//console.log(response)
		})
	}

	/*
		It update values of all the UI fields based on the current state
		It accepts a hook which receives each element
		to do whatever the programmer wants
	*/
	renderFields = hook => {
		console.log('rendering...')
		let fields = document.getElementsByClassName('ui-field')
		//console.log(this.state)
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
		
		e.preventDefault()

		let queryInfo = {
			active: true,
			currentWindow: true
		}

		const message = new Message({
			context: 'content',
			subject: 'sequence',
			item: e.target.name,
			data: this.state
		})

		if(e.target.name === 'stop'){

			message.subject = 'order'

		} else 

		if(e.type === 'contextmenu'){
			message.subject = 'sequence-test'
		} 

		const sendClickMessage = (tabs) => {
			console.log('sending', message, 'to', tabs[0].id, queryInfo)
			Browser.sendMessageToTab(tabs[0].id, message, (message) => {
				console.info('click response', message)
				if(message === undefined){
					console.info('ENDING DID NOT RESPOND. Sending order again!')
					Browser.queryTabs(queryInfo, sendClickMessage)
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

		Browser.queryTabs(queryInfo, sendClickMessage)
	}

	/*
		It get state from background script and it passed the data to callback argument
	*/
	fetchState({ callback }) {
		//console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		console.log('fetching state')
		const request = new Message({ context: "background", subject: "get", item: UI.CONSTANTS['UI_STATE'] })
		Browser.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	getBotCurrentSequence({ callback }) {
		let queryInfo = {
			active: true,
			currentWindow: true
		}
		Browser.queryTabs(queryInfo, (tabs) => {
			const data = {
				tabId: tabs[0].id
			}
			const request = new Message({ context: "background", subject: "get", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE'], data })
			Browser.sendMessage(request, (response) => {
				if(typeof callback === 'function') callback(response.data)
			})

		})
	}

	/*
		It updates the state both the on background script and on the object itself
	*/
	updateState = ({ state, callback, replace = false }) => {
		//console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		if(state){
			if(replace){
				this.state = {...state}
			} else {
				this.state = Deep.merge({...this.state}, {...state})
			}
		}
		const request = new Message({ context: "background", subject: "set", item: UI.CONSTANTS['UI_STATE'], data: {...this.state} })
		Browser.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	/*
		It updates a field from state
		It updates the state both the on background script and on the object itself
	*/
	updateField = ({ type, name, value, callback }) => {
		this.state.fields[type][name] = value
		const request = new Message({ context: "background", subject: "set", item: UI.CONSTANTS['UI_STATE'], data: {...this.state} })
		Browser.sendMessage(request, (response) => {
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