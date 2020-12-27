class Bot {

	state = {
		currentSequence: null
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
			const {moduleName, sequenceName} = this.state.currentSequence
			$jSpaghetti.module(moduleName).sequence(sequenceName).reset(callback)
		} else {
			if(typeof callback === 'function') callback()
		}
	}

	startSequence({ moduleName, sequenceName }) {
		this.state.currentSequence = {
			moduleName,
			sequenceName
		}
		const sequence = $jSpaghetti.module(moduleName).sequence(sequenceName)
		function resetSequence(){
			sequence.reset()
			sequence.events.removeEventListener("terminated", resetSequence)
		}
		sequence.events.addEventListener("terminated", resetSequence)
		sequence.run()
	}


}