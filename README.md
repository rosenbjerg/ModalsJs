# ModalsJs


Loading the library creates the object ModalsJs which has a number of functions:

`open(html, options)` opens a modal view using the input html. 

`openImage(src, title, desc)` opens a modal image view using the parameters. 

`close(ignoreWarning, modal)` closes the topmost modal view. 
If `ignoreWarning === true` then warnings will be ignored. 
If a reference to an open modal is passed as second parameter, 
that specific modal will be closed.

`closeAll()` closes all modals and ignores warnings.

`prompt(promptOptions, onAccept, onReject)` opens a prompt using the `title`, `accept` and `reject` 
fields on the options-object to create a modal prompt. 
Callbacks are only invoked if user presses accept or reject button.