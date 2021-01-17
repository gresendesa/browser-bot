/*
	Piece of information exchanged between extension scopes
	Subject refers to the brief description of the information
	Item refers to a specific target of the receiver
	Data stores all secondary data that follows the message
*/
class Message {
	constructor({context, subject, item, data}){
		this.context = context
		this.subject = subject
		this.item = item
		this.data = data
	}
}

