class Jira {

	static gerarRelatorioEmJSON(demandas) {
		return JSON.stringify(demandas)
	}

	static gerarRelatorioTabular(demandas) {
		const lines = []
		demandas.forEach(demanda => {
			const line = [
				demanda.nome,
				demanda.tipo,
				demanda.tecnologia,
				demanda.pfBruto,
				demanda.pfAjustado
			]
			lines.push(line.join('\t'))
		})
		return lines.join('\n')
	}

}

Jira.Demanda  = class {
	constructor(nome, tipo, tecnologia, pfBruto, pfAjustado) {
		this.nome = nome
		this.tipo = tipo
		this.tecnologia = tecnologia
		this.pfBruto = pfBruto
		this.pfAjustado = pfAjustado
	}
}