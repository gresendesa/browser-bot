class UI {

	constructor() {
		
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

	fields = {
		text: {

		},
		booleans: {

		},
		options: {

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

	static getFields() {
		
	} 

	static updateField(type, name, value){

	}

}