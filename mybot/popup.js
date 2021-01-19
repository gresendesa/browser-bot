const ui = new UI()

document.getElementById('button-open-jira-input').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value ] = [ 'text', 'jira-input', '' ]
	ui.updateField({
		type, name, value,
		callback: () => {
			ui.renderFields()
		}
	})
})

document.getElementById('button-open-jira-output').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value ] = [ 'text', 'jira-output', '' ]
	ui.updateField({
		type, name, value,
		callback: () => {
			ui.renderFields()
		}
	})
})