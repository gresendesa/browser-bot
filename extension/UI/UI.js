class UI {

	constructor() {
			
		const bootstrap = () => {
			console.log('bootstrap', this.state)
			let orders = document.getElementsByClassName('ui-order')
			Array.prototype.forEach.call(orders, (elem) => {
				elem.addEventListener('click', this.activateOrderTrigger)
			})
			let fields = document.getElementsByClassName('ui-field')
			Array.prototype.forEach.call(fields, (elem) => {

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
				elem.addEventListener('change', this.onFieldChange)
			})

			let queryInfo = {
				active: true,
				currentWindow: true
			}
			chrome.tabs.query(queryInfo, UI.sendLoadMessage)
		} 

		const callback = (state) => {
			if(state){
				this.state = state
				bootstrap(this.state)
			} else {
				this.updateState({ state: this.state, callback: bootstrap })
			}
		}

		this.fetchState({ callback })

	}

	static get CONSTANTS() {
		return {
			'UI_STATE': 'ui-state'
		}
	}

	state = {
		fields: {
			text: {},
			boolean: {},
			option: {},
			radio: {}
		}	
	}

	static sendLoadMessage(tabs){
		const message = {
			subject: 'loaded'
		}
		chrome.tabs.sendMessage(tabs[0].id, message)
	}

	activateOrderTrigger = (e) => {
		let queryInfo = {
			active: true,
			currentWindow: true
		}
		const message = {
			subject: 'order',
			item: e.target.name,
			data: this.state
		}
		function sendClickMessage(tabs){
			chrome.tabs.sendMessage(tabs[0].id, message)
		}
		chrome.tabs.query(queryInfo, sendClickMessage)
	}

	fetchState({ callback }) {
		console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		console.log('fetching state')
		const request = { subject: "get", item: UI.CONSTANTS['UI_STATE'], data: null }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	updateState({ state, callback }){
		console.log('ui constants', UI.CONSTANTS['UI_STATE'])
		console.log('updating state')
		const request = { subject: "set", item: UI.CONSTANTS['UI_STATE'], data: state }
		chrome.runtime.sendMessage(request, (response) => {
			this.state = state
			if(typeof callback === 'function') callback()
		})
	}

	updateField({ type, name, value, callback }) {
		this.state.fields[type][name] = value
		const request = { subject: "set", item: UI.CONSTANTS['UI_STATE'], data: {...this.state} }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback()
		})
	}

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