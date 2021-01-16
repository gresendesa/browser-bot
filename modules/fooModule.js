let fooMod = $jSpaghetti.module("foo")
fooMod.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

fooMod.sequence("test").instructions = [
    {1: ["test0"]}
]

fooMod.sequence("remove").instructions = [
    {0: "C"},
    {"foo": [{"wait":2000},"A", "B"]}
]

fooMod.sequence("clear").instructions = [
    {0: "_exit"}
]

//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

fooMod.procedure("test0", function(shared, hooks){
    hooks.showMessage({ message: `Testing...`, level: 'warning' })
    setTimeout(() => {
        hooks.next(true)
    }, 2000)
})

fooMod.procedure("A", function(shared){
	console.log("A",shared)
    console.log("brown fox jumps ")
    return true
})
fooMod.procedure("B", function(shared){
	console.log("B",shared)
    console.log("over the lazy dog")
    return true
})
fooMod.procedure("C", function(shared, hooks){
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