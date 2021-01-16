let mod = $jSpaghetti.module("browse")
mod.config.debugMode = true

//*****************************************************//
// SEQUENCES INSTRUCTIONS ↓ ↓ ↓
//_____________________________________________________//

mod.sequence("browse-on-internet").instructions = [
    {"start":             ["get-first-links"]},
    {"start-browsing":    ["get-random-link", {"exit": "!*.isThereLinks"}, "scrap-page-links", {"jumpif":[1, "start-browsing"]}]}
]

//*****************************************************//
// PROCEDURES ↓ ↓ ↓
//_____________________________________________________//

mod.procedure("get-first-links", function(shared){
    shared.links = ["https://www.globo.com"]
    return true
})

mod.procedure("get-random-link", function(shared, hooks){
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

mod.procedure("scrap-page-links", function(shared, hooks){

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
