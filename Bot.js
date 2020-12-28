class Bot {

	state = {
		currentSequence: null
	}

	static CONSTANTS() {
		return {
			'CURRENT_SEQUENCE_STORAGE': 'bot-current-sequence'
		}
	}

	constructor() {
		$jSpaghetti.Storage = BackgroundStorage 
		const onOrder = (message, sender, sendReponse) => {
			const order = message.subject
			if(order === "loaded"){
				console.log('window opened')
			} else
			if(order === "remove"){
				this.startSequence({ moduleName: 'foo', sequenceName: 'remove' })
			} else
			if(order === "add"){
				console.log("adding")
			} else 
			if(order === "stop"){
				this.stop(() => {
					console.log('program stopped')
				})
			} else {
				console.log("unknown command")
			} 
		}
		chrome.runtime.onMessage.addListener(onOrder)
	}

	stop(callback) {
		if(this.state.currentSequence !== null){
			const { moduleName, sequenceName } = this.state.currentSequence
			$jSpaghetti.module(moduleName).sequence(sequenceName).reset(() => {
				const request = new Message({ subject: "reset", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE']})
				chrome.runtime.sendMessage(request, (response) => {
					this.state.currentSequence =  null
					if(typeof callback === 'function') callback()
				})
			})
		} else {
			if(typeof callback === 'function') callback()
		}
	}

	startSequence({ moduleName, sequenceName }) {
		this.state.currentSequence = {
			moduleName,
			sequenceName
		}
		const request = new Message({ subject: "set", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE'], data: this.state.currentSequence })
		chrome.runtime.sendMessage(request, (response) => {
			const sequence = $jSpaghetti.module(moduleName).sequence(sequenceName)
			const resetSequence = () => {
				this.stop(() => {
					sequence.events.removeEventListener("terminated", resetSequence)
				})				
			}
			sequence.events.addEventListener("terminated", resetSequence)
			sequence.run()
		})	
	}

	run() {
		const request = new Message({subject: "get", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE']})
		chrome.runtime.sendMessage(request, (response) => {
			if(response.data){
				const { moduleName, sequenceName } = response.data
				this.startSequence({ moduleName, sequenceName })
			}
		})
	}
}