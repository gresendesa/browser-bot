var mod = $jSpaghetti.module("foo")
mod.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

mod.sequence("remove").instructions = [
    {0: "C"},
    {"foo": [{"wait":2000},"A", "B"]}
]

mod.sequence("add").instructions = [
    {0: "A"},
    {"foo": [{"wait":100},"C", "B"]}
]

//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

mod.procedure("A", function(){
    console.log("brown fox jumps ")
    return true
})
mod.procedure("B", function(){
    console.log("over the lazy dog")
    return true
})
mod.procedure("C", function(shared, hooks){
    console.log("quick ")
    return true
})