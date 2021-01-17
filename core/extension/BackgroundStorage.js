/*Customized storage to work with Chrome extension*/
class BackgroundStorage {

	constructor(storageName){
		this.storageName = storageName
	}

	get(callback){
		const request = new Message({ context: "background", subject: "get", item: this.storageName })
		Browser.sendMessage(request, function(response) {
			if(typeof callback === 'function') callback(response.data)
		})

	}
	set(data, callback){
		const request = new Message({ context: "background", subject: "set", item: this.storageName, data })
		Browser.sendMessage(request, function(response) {
			if(typeof callback === 'function') callback()
		})
	}

	reset(callback){
		const request = new Message({ context: "background", subject: "reset", item: this.storageName })
		Browser.sendMessage(request, function(response) {
			if(typeof callback === 'function') callback()
		})
	}
}