/*
	This class centralizes all the browser API interactions
*/

class Browser {

	constructor() {

	}

	static sendMessage(message, callback) {
		chrome.runtime.sendMessage(message, callback)
	}

	static sendMessageToTab(tabId, message, callback) {
		chrome.tabs.sendMessage(tabId, message, callback)
	}

	static listenToMessages(callback) {
		chrome.runtime.onMessage.addListener(callback)
	}

	static queryTabs(queryInfo, callback) {
		chrome.tabs.query(queryInfo, callback)
	}

	static listenToErrors(callback){
		//Currently no way to do that was found
	}

}