let mdule = $jSpaghetti.module("foo")
mdule.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

mdule.sequence("remove").instructions = [
    {0: "C"},
    {"foo": [{"wait":2000},"A", "B"]}
]

mdule.sequence("clear").instructions = [
    {0: "_exit"}
]

//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

mdule.procedure("A", function(shared){
	console.log("A",shared)
    console.log("brown fox jumps ")
    return true
})
mdule.procedure("B", function(shared){
	console.log("B",shared)
    console.log("over the lazy dog")
    return true
})
mdule.procedure("C", function(shared, hooks){
	console.log("C",shared, hooks)
    const { sayHello, updateUI, next } = hooks
    let state = {
        fields: {
            text: {
                email: 'mané'
            }
        }
    }
    let callback = response => {
        console.log(response)
        sayHello()
        console.log("quick ")
        next(true)
    }
    updateUI({ state, callback })

    /*updateUIField({
        type: 'text',
        name: 'email',
        value: 'testando os valores do bot',
        callback
    })*/
    
    //return true
})