class Bot {

	 constructor() {
	 	$jSpaghetti.Storage = BackgroundStorage //It tells jSpaghetti to work with background script as storage
	 	chrome.runtime.onMessage.addListener(this.#onOrder)
	 }

	 stop() {

	 }

	 #onOrder(message, sender, sendReponse) {
		const order = message.subject

		if(order === "loaded"){
			console.log('window opened')
		} else
		if(order === "remove"){
			const foo = $jSpaghetti.module("foo")
			const sequence = foo.sequence("remove")
			function resetSequence(){
				sequence.reset()
				sequence.events.removeEventListener("terminated", resetSequence)
			}
			sequence.events.addEventListener("terminated", resetSequence)
			sequence.run()
		} else
		if(order === "add"){
			console.log("adding")
		} else {
			console.log("unknown command")
		} 

	 }

}