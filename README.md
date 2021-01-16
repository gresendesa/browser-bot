# BrowserBot v0.1.1 - December 27 - 2020

## What is that for?

This software was designed mainly to be used as a automation tool for browsers, mostly on Google Chrome.

## Changelog

- **0.1.1** documentation to describe basic bot concept and UI improvements.
- **0.1.0** basic project structure. Manifest.json and extension, tasks, vendor directories.

## Directories and classes

- **extension** _directory_ contains all extension related files.
	* **Extension** _class_ represents the extension itself. It extends the Bot class.
	* **Message** _class_ describes the messages exchanged between extension scopes.
	* **BackgroundStorage** _class_ implements the Storage for jSpaghetti vendor to work with background script.
	* **background** _directory_ contains all the background scripts.
	* **UI** _directory_ contains all the html, js, css to build the user interface for the extension.
- **Bot** _class_ represents the extension itself.
- **vendor** _directory_ contains all the third-parts included on content and background scripts.
- **modules** _directory_ contains all the bot tasks. On this project, jSpaghetti modules compose all tasks especifications through its sequences: instructions using procedures.

## Basic operation

The bot execute tasks through jSpaghetti modules. The UI listens for operator orders. An order is translated to a Message that goes from UI, which lives on action script, to the Bot, which lives on content script. The Bot calls the bind sequence to the order received. jSpaghetti consumes eventually the background script as storage to save/restore the sequence state.

The UI uses the background script as storage as well to save/restore UI content inserted by operator or the Bot itself.

## UI 

The UI is a action script that have html, css and js files bind. The information contained on fields, buttons, et cetera, are saved/restored on the background storage. Such information can be retreived directly from the background script using a get message over the `Extension.CONSTANTS['UI_STORAGE']` item.

For HTML elements: Each interactable element of UI must be marked with `.ui` class. Each clickable element that fires an order should carry the `.ui-order`; The order id must be placed on `name` attribute of the tag. Each data container element on UI is supposed to be assigned with `.ui-field` class. Each container field will be distinguished by its name, on `name` attribute of the tag. Additionally each field has to be identified by its type using a proper class:

- `.ui-container-text` for fields that stores strings, numbers, or any kind of text directly.
- `.ui-container-boolean` for checkboxes, for example.
- `.ui-container-option` for lists of options.
- `.ui-container-radio` for lists of options using radio input.

The UI data are stored as an object separated by type as following example:
```json
{
	"fields":{
		"text":{
			"fieldtext1": "some text",
			"fieldtext2": "some text"
		},
		"boolean":{
			"fieldbool1": true,
			"fieldbool2": false
		},
		"option":{
			"fieldoption1": "1"
		},
		"radio":{
			"fieldradio1": "10"
		}
	}
}
```

Each `.ui-order` element should contain in `name` attribute, the jSpaghetti module followed by the sequence name. module and sequence name must be separated with the `:` character. The button which stops the bot should carry the "stop" string on the name attribute.



