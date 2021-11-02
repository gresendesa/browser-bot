class MyBot extends Bot {

	constructor() {
		super()
		this.registerHook('classes', Jira)
	}

}