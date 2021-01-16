class Bot {

	state = {
		currentSequence: null,
		ready: false
	}

	static get CONSTANTS() {
		return {
			'CURRENT_SEQUENCE_STORAGE': 'bot-current-sequence'
		}
	}

	/*
		This constructor binds future orders to sequences of jSpaghetti
		It pretty much set a listener for incomming messages
	*/
	constructor() {
		$jSpaghetti.Storage = BackgroundStorage
		const onMessage = (message, sender, sendReponse) => {
			//console.log(message)
			const { text, color } = new BrowserConsole()
			const { context, subject, item, data } = message
			const bot = data
			if(context === 'content'){

				if ((subject === 'sequence') || (subject === 'sequence-test')){

					sendReponse(new Message({ subject: 'response', item: 'sequence received' }))

					var [ moduleName, sequenceName ] = item.split(':',2)
					
					if(subject === 'sequence-test'){
						sequenceName = 'test'
					}

					const props = bot
					this.startSequence({ moduleName, sequenceName, props })

				} else

				if (subject === 'order'){

					sendReponse(new Message({ subject: 'response', item: 'stop order received' }))

					if(item === "stop"){
						this.stop(() => {
							console.log(text('program stopped'), color('success'))
						})
					}

				} else

				if (subject === 'event'){

					sendReponse(new Message({ subject: 'response', item: 'event received' }))

					if(item === "loaded"){

						console.log(text('window opened'), color('info'))

					} 

				} else {

					sendReponse(new Message({ subject: 'response', item: 'unknown content subject' }))

				}
				
			}

			return true
		}

		Browser.listenToMessages(onMessage)
	}

	/*
		This function resets the current sequence if it is available
		and then executes the callback which is passed
	*/
	reset(callback) {
		if(this.state.currentSequence !== null){
			const { moduleName, sequenceName } = this.state.currentSequence
			$jSpaghetti.module(moduleName).sequence(sequenceName).reset(() => {
				const request = new Message({ context: "background", subject: "reset", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE']})
				Browser.sendMessage(request, (response) => {
					this.state.currentSequence = null
					if(typeof callback === 'function') callback()
				})
			})
		} else {
			UI.showMessage('Done! Already stopped!', 'success')
			if(typeof callback === 'function') callback()
		}
	}

	/*
		As the stop message comes from outside, it's possible to get this order
		before bot is properly loaded. 
		This function calls itself util bot is ready to be stopped
		The callback passed is executed before bot is stopped
	*/
	stop(callback) {
		const { text, color } = new BrowserConsole()
		console.log(text('stop called. bot ready?'), color('warning'), this.state.ready)
		if(this.state.ready){
			this.reset(callback)
			const request = new Message({ context: "ui", subject: "bot-reset" })
			Browser.sendMessage(request, (response) => {
				//console.log(response)
			})
		} else {
			setTimeout(() => {
				this.stop(callback)
			}, 0)
		}
	}

	/*
		This function starts a jSpaghetti sequence passing to it props
		that will be available on the first argument of the procedures
		That function passes to the sequence the defined hooks as well
		It also changes the bot state on the background script
	*/
	startSequence({ moduleName, sequenceName, props }) {
		this.state.currentSequence = {
			moduleName,
			sequenceName
		}
		const request = new Message({ context: "background", subject: "set", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE'], data: this.state.currentSequence })
		Browser.sendMessage(request, (response) => {
			const sequence = $jSpaghetti.module(moduleName).sequence(sequenceName)

			Object.assign(sequence.hooks, new Util()) //Push custom hooks to sequence
			
			if(props){
				sequence.state.shared.props = props
			}
			const resetSequence = () => {
				this.stop(() => {
					sequence.events.removeEventListener("terminated", resetSequence)
					UI.showMessage('Done!', 'success')
				})				
			}
			const errorSequence = (error) => {
				this.stop(() => {
					sequence.events.removeEventListener("error", errorSequence)
					UI.showMessage(error.detail, 'danger')
				})				
			}
			sequence.events.addEventListener("terminated", resetSequence)
			sequence.events.addEventListener("error", errorSequence)
			sequence.run()
			UI.showMessage('Running sequence', 'info')

		})	
	}

	/*
		This method requests the background script in order to load sequence state
		If no sequence is active nothing happens, but the ready property of the bot
		is set as true anyway
	*/
	start() {
		const request = new Message({ context: "background", subject: "get", item: Bot.CONSTANTS['CURRENT_SEQUENCE_STORAGE'] })
		Browser.sendMessage(request, (response) => {
			if(response.data){
				const { moduleName, sequenceName } = response.data
				this.startSequence({ moduleName, sequenceName })
			}
			this.state.ready = true
		})
		Browser.listenToErrors((errorMessage) => {
			UI.showMessage(errorMessage, 'dark')
		})
	}
}