var module = $jSpaghetti.module("foo")

module.config.debugMode = true

module.procedure("A", function(){
    console.log("brown fox jumps ")
    return true
})
module.procedure("B", function(){
    console.log("over the lazy dog")
    return true
})
module.procedure("C", function(shared, hooks){
    console.log("quick ")
    return true
})