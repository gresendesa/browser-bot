class BrowserConsole {

	constructor(label, size = 15) {
		this.label = ((label) ? `${label} ` : '')
		this.size = size
	}

	text = (text) => {
		return `${this.label}%c${text}`
	}

	color = (color) => {
		const fontSize = `${this.size}px`;
		switch (color) {
			case 'primary':
				return `background: #337ab7; color: #f8faff; font-size: ${fontSize};`
			case 'basic':
				return `background: #cecece; color: #06266d; font-size: ${fontSize};`
			case 'success':
				return `background: #5cb85c; color: #f1f9f9; font-size: ${fontSize};`
			case 'info':
				return `background: #5bc0de; color: #f1f9f9; font-size: ${fontSize};`
			case 'warning':
				return `background: #f0ad4e; color: #f1f9f9; font-size: ${fontSize};`
			case 'danger':
				return `background: #d9534f; color: #f1f9f9; font-size: ${fontSize};`
			default:
				return `background: #ffffff; color: #7f3f39; font-size: ${fontSize};`
		}
	}

}