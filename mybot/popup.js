var userInterface = new UI({
	filters: {
		fields: {
			
		}
	}
})
const { updateField } = userInterface;

document.getElementById('button-open-jira-input').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value ] = [ 'text', 'jira-input', ' ' ]
	const callback = () => {
		userInterface.render()
		userInterface.printMessage('OK! input limpo', UI.CONSTANTS['PRINT_LEVELS'].success)
	}
	updateField({ type, name, value, callback })
})

document.getElementById('button-open-jira-output').addEventListener('contextmenu', (event) => {
	event.preventDefault()
	const [ type, name, value ] = [ 'text', 'jira-output', ' ' ]
	const callback = () => {
		userInterface.render()
		userInterface.printMessage('OK! output limpo', UI.CONSTANTS['PRINT_LEVELS'].success)
	}
	updateField({ type, name, value, callback })
})