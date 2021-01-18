const ui = new UI()

document.getElementById('button-open-jira-input').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value, callback ] = [ 'text', 'jira-input', '', () => {
		
	}]
	ui.updateField({ type, name, value, callback })
})

document.getElementById('button-open-jira-output').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value, callback ] = [ 'text', 'jira-output', '', () => {

	}]
	ui.updateField({ type, name, value, callback })
	
})