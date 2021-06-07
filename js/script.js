// NOTE: When debugging add window. to each variable

/* global $ HangmanView WindowView HangmanModel */

$(document).ready(function () {
  var model = new HangmanModel()
  var hangmanView = new HangmanView(model)
  var windowView = new WindowView(hangmanView, model)
  windowView.init()
}) // end ready
