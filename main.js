new Bot()

//*****************************************************//
// put bwlow sequences that should be running everytime
//_____________________________________________________//

$jSpaghetti.module("foo").sequence("add").reset(function(sequence){
	sequence.run()
})