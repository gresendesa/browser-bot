chrome.runtime.onMessage.addListener(requestHandler)

var storage = []

function requestHandler(request, sender, sendResponse){

	var response = undefined

	if(request.subject === 'get'){
		response = storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)]
		sendResponse(new Message({subject: 'response', data: response}))
	} else
	if(request.subject === 'set'){
		storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)] = request.data
		response = 'item set'
		sendResponse(new Message({subject: 'response', data: response}))
	} else
	if(request.subject === 'reset'){
		storage[String(`${request.item}:${(sender.tab ? sender.tab.id : 0)}`)] = null
		response = 'item reset'
		sendResponse(new Message({subject: 'response', data: response}))
	}

	console.log({ request , response, storage })
}