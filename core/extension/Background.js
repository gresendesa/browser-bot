class Background {
	
	static storage = []

	static secondaryRequestHandler = null

	static registerSecondaryRequestHandler(func) {
		Background.secondaryRequestHandler = func
	}

	static reply(request, response, sendResponse){
		sendResponse(new Message({subject: 'response', data: response}))
		console.log({ request , response, storage: Background.storage })
	}

	static requestHandler(request, sender, sendResponse){

		if(request.context === 'background'){

			//-------------------------------------------------------------//
			 /*	pass 'tabId' over data to request cross tab information   */
			//-------------------------------------------------------------//
			const crossTabId = ((request.data) ? request.data.tabId : null)
			var tabId = (sender.tab ? sender.tab.id : 0)
			if (typeof crossTabId === 'number') tabId = crossTabId
			//-------------------------------------------------------------

			if(request.subject === 'get'){
				const response = Background.storage[String(`${request.item}:${tabId}`)]
				Background.reply(request, response, sendResponse)
			} else
			if(request.subject === 'set'){
				Background.storage[String(`${request.item}:${tabId}`)] = request.data
				const response = 'item set'
				Background.reply(request, response, sendResponse)
			} else
			if(request.subject === 'reset'){
				Background.storage[String(`${request.item}:${tabId}`)] = null
				const response = 'item reset'
				Background.reply(request, response, sendResponse)
			} else
			if(typeof Background.secondaryRequestHandler === 'function'){
				Background.secondaryRequestHandler(request, sender, sendResponse)
			}

		}
			
		return true
		
	}
}

Browser.listenToMessages(Background.requestHandler)