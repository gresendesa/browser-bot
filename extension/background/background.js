chrome.runtime.onMessage.addListener(requestHandler)

var storage = []

function requestHandler(request, sender, sendResponse){

	console.log(request)

	if(request.subject === 'get'){
		let data = storage[String(`${request.item}:${sender.tab.id}`)]
		sendResponse(new Message({subject: 'response', data}))
	} else
	if(request.subject === 'set'){
		storage[String(`${request.item}:${sender.tab.id}`)] = request.data
		let data = 'item set'
		sendResponse(new Message({subject: 'response', data}))
	} else
	if(request.subject === 'reset'){
		storage[String(`${request.item}:${sender.tab.id}`)] = null
		let data = 'item set'
		sendResponse(new Message({subject: 'response', data}))
	}
}