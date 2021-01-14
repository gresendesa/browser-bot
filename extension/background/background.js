chrome.runtime.onMessage.addListener(requestHandler)

var storage = []

function reply(request, response, sendResponse){
	sendResponse(new Message({subject: 'response', data: response}))
	console.log({ request , response, storage })
}

function requestHandler(request, sender, sendResponse){

	if(request.context === 'background'){

		//-------------------------------------------------------------//
		 /*	pass 'tabId' over data to request cross tab information   */
		//-------------------------------------------------------------//
		const crossTabId = ((request.data) ? request.data.tabId : null)
		var tabId = (sender.tab ? sender.tab.id : 0)
		if (typeof crossTabId === 'number') tabId = crossTabId
		//-------------------------------------------------------------

		if(request.subject === 'get'){
			const response = storage[String(`${request.item}:${tabId}`)]
			reply(request, response, sendResponse)
		} else
		if(request.subject === 'set'){
			storage[String(`${request.item}:${tabId}`)] = request.data
			const response = 'item set'
			reply(request, response, sendResponse)
		} else
		if(request.subject === 'reset'){
			storage[String(`${request.item}:${tabId}`)] = null
			const response = 'item reset'
			reply(request, response, sendResponse)
		}

	}
		
	return true
	
}