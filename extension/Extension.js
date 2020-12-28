class Extension extends Bot {

	constructor() {
		super()
	}

	static CONSTANTS() {
		return {
			'UI_STORAGE': 'ui-state',
			...Bot.CONSTANTS()
		}
	}

	fetchUI({ callback }) {
		const request = new Message({ subject: "get", item: Extension.CONSTANTS['UI_STORAGE'], data: props })
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback(response.data)
		})
	}

	setUI({ props, callback }) {
		const request = new Message({ subject: "set", item: Extension.CONSTANTS['UI_STORAGE'], data: props })
		chrome.runtime.sendMessage(request, (response) => {
			if(typeof callback === 'function') callback()
		})
	}

}