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

mdule.procedure("A", function(){
    console.log("brown fox jumps ")
    return true
})
mdule.procedure("B", function(){
    console.log("over the lazy dog")
    return true
})
mdule.procedure("C", function(shared, hooks){
    console.log("quick ")
    return true
})