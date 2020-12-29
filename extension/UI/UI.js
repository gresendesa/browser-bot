class UI {

	constructor() {
			
		const bootstrap = () => {
			console.log('bootstrap', this.state)
			let orders = document.getElementsByClassName('ui-order')
			Array.prototype.forEach.call(orders, (elem) => {
				elem.addEventListener('click', UI.activateOrderTrigger)
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
			booleans: {},
			options: {}
		}	
	}

	static sendLoadMessage(tabs){
		const message = {
			subject: 'loaded'
		}
		chrome.tabs.sendMessage(tabs[0].id, message)
	}

	static activateOrderTrigger(e){
		let queryInfo = {
			active: true,
			currentWindow: true
		}
		const message = {
			subject: e.target.name
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
		const request = { subject: "set", item: UI.CONSTANTS['UI_STATE'], data: this.fields }
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback()
		})
	}

}