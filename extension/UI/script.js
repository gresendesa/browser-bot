const buttons = document.getElementsByClassName('trigger')

function addListeners(button){
	button.addEventListener('click', onClick)
}

Array.prototype.forEach.call(buttons, addListeners);

function onLoad(){
	let queryInfo = {
		active: true,
		currentWindow: true
	}
	chrome.tabs.query(queryInfo, sendLoadMessage)
}

function sendLoadMessage(tabs){
	const message = {
		subject: 'loaded'
	}
	chrome.tabs.sendMessage(tabs[0].id, message)
}

function onClick(event){
	let queryInfo = {
		active: true,
		currentWindow: true
	}
	const message = {
		subject: event.target.name
	}

	function sendClickMessage(tabs){
		chrome.tabs.sendMessage(tabs[0].id, message)
	}

	chrome.tabs.query(queryInfo, sendClickMessage)
} 

onLoad()