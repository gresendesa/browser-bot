chrome.runtime.onMessage.addListener(requestHandler)

var storage = []

function reply(request, response, sendResponse){
	sendResponse(new Message({subject: 'response', data: response}))
	console.log({ request , response, storage })
}

function requestHandler(request, sender, sendResponse){

	if(request.context === 'background'){

		if(request.subject === 'get'){
			const response = storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)]
			reply(request, response, sendResponse)
		} else
		if(request.subject === 'set'){
			storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)] = request.data
			const response = 'item set'
			reply(request, response, sendResponse)
		} else
		if(request.subject === 'reset'){
			storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)] = null
			const response = 'item reset'
			reply(request, response, sendResponse)
		}

	}
		
	return true
	
}