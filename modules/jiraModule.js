let jiraModule = $jSpaghetti.module("jira")
jiraModule.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

jiraModule.sequence("relatório-de-faturamento").instructions = [
    {'@inicio': "iniciar-processo"},
    {'@entrar': ["logar-se-necessário", "selecionar-mês-ano", "ler-demandas"]}
]

jiraModule.sequence("test").instructions = [
    {'@test': "ler-demandas"},
]

jiraModule.sequence("dizer-olá").instructions = [
    {'@começar': "dizer"},
]


//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

jiraModule.procedure("dizer", function(shared, hooks){
   alert('Olá ^.^')
   return true
})

jiraModule.procedure("iniciar-processo", function(shared, hooks){
   hooks.next(true)
   hooks.navigate('https://jira.engesoftware.com.br/plugins/servlet/faturamentoreport')
})

jiraModule.procedure("logar-se-necessário", function(shared, hooks){
	if(window.location.pathname === '/login.jsp'){
		hooks.next(true)
		const { username, password } = shared.props.fields.text
		document.getElementById('login-form-username').value = username
		document.getElementById('login-form-password').value = password
		document.getElementById('login-form-submit').click()
	}
	return false
})

jiraModule.procedure("ler-demandas", function(shared, hooks){

	hooks.showMessage('pegando demandas')
	let container = hooks.getElementByXpath('//*[@id="content"]/div[2]/div/section/div[2]/table/tbody')
	if (!container) throw 'sem demandas neste mês'
	const demandas = []
	container.childNodes.forEach(node => {
		if (node.nodeName === 'TR'){
			const values = []
			node.childNodes.forEach(node => {
				if (node.nodeName === 'TD'){
					values.push(node.innerText)
				}
			})
			const demanda = new hooks.classes.Jira.Demanda(values[0], values[3], values[4], Number(values[5]), Number(values[6]))
			console.log(demanda)
		}
	})
	return false

})

jiraModule.procedure("selecionar-mês-ano", function(shared, hooks){
	if(window.location.pathname === '/plugins/servlet/faturamentoreport'){
		const mesSelect = hooks.getElementByXpath('//*[@id="content"]/div[1]/div/section/form/div/fieldset/fieldset/div[1]/fieldset/div/select[1]')
		const anoSelect = hooks.getElementByXpath('//*[@id="content"]/div/div/section/form/div/fieldset/fieldset/div[1]/fieldset/div/select[2]')
		const { mes, ano } = shared.props.fields.option
		mesSelect.value = mes
		anoSelect.value = ano
		const submitButton = hooks.getElementByXpath('//*[@id="content"]/div/div/section/form/div/fieldset/fieldset/div[2]/div/div/input')
		hooks.next(true)
		submitButton.click()
		//console.log(mes, ano, shared.props.fields)
	}
	return false
})

//plugins/servlet/faturamentoreport

