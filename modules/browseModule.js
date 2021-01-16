let browseMod = $jSpaghetti.module("browse")
browseMod.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

browseMod.sequence("test").instructions = [
    {1: ["test0"]}
]

browseMod.sequence("browse-on-internet").instructions = [
    {"start":             ["get-first-links"]},
    {"start-browsing":    ["get-random-link", {"exit": "!*.isThereLinks"}, "scrap-page-links", {"jumpif":[1, "start-browsing"]}]}
]

//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

browseMod.procedure("test0", function(shared, hooks){
    hooks.showMessage({ message: `Testing...`, level: 'warning' })
    setTimeout(() => {
        hooks.next(true)
    }, 2000)
})

browseMod.procedure("get-first-links", function(shared){
    shared.links = ["https://www.globo.com"]
    return true
})

browseMod.procedure("get-random-link", function(shared, hooks){
    //var link = shared.links.shift()

    var link = shared.links[Math.floor(Math.random() * shared.links.length)]

    hooks.showMessage({ message: `Get random link from the list: ${link}`, level: 'primary' })

    shared.isThereLinks = false
    hooks.next()
    if(link){
        shared.isThereLinks = true
        window.location.replace(link)
    } else {
        const { text, color } = new BrowserConsole('links', 10)
        console.log(text('no links'), color('warning'))
    }
})

browseMod.procedure("scrap-page-links", function(shared, hooks){

    shared.links = []

    if(shared.isThereLinks){
        var links = document.getElementsByTagName('a')
        const { text, color } = new BrowserConsole('links', 10)
        console.log(text(links.length), color('warning'))
        hooks.showMessage({ message: `I've got ${links.length} more links`, level: 'info' })
        Array.prototype.forEach.call(links, (l) => {
            shared.links.push(l.href)
        })
    } 
    return true
})
