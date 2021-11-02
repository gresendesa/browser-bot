Background.registerSecondaryRequestHandler((request, sender, sendResponse) => {
	console.log('secondary request handler ok')
	return true
})