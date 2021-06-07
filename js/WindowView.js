/* global $ */

const alphabet = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lettersPerRow = 5
const reset = 0

class WindowView {

  constructor (view, model) {
    this.model = model
    this.hangman = view
  }

  /* init  */
  init () {
    this.input = $('.input')
    this.buttons = {
      play: $('.play'),
      instructions: $('.instructions'),
      newGame: $('.newGame'),
      forward: $('.forward'),
      reverse: $('.reverse'),
      custom: $('.custom'),
      random: $('.random')
    }

    this.displays = {
      display: $('.display'),
      tutorial: $('#tutorial'),
      welcome: $('.welcome'),
      game: $('#game'),
      letters: $('.letters'),
      underscore: $('.underscore')
    }

    this.renderLetters()
    this.displays.letter = $('.letter')

    this.listen()
    this.initGame()
  }

  /* initializes the game back to square zero */
  initGame () {
    this.makeClickable(this.displays.letter)
    this.hangman.initHangman()
    this.setReverseMode()
    this.setRandomWord()

    $('.audio').trigger('load')
  }

  /* Renders Letters A-Z onto the screen */
  renderLetters () {
    for (var i = 1; i < alphabet.length; i++) {
      var $newRow = $('<div class="row"></div>')

      while (i !== 27) {
        var $newDiv = $('<div class="letter"></div>').addClass(alphabet[i]).text(alphabet[i])
        $newRow.append($newDiv)

        if (i % lettersPerRow === 0) { break } // five letters per row
        i++
      }

      this.displays.letters.append($newRow)
    }
  }

  /* Adds all event listeners for the game */
  listen () {
    this.displays.letter.on('click', this.handleLetterClick.bind(this))

    this.buttons.custom.on('click', this.getCustomWord.bind(this))
    this.buttons.random.on('click', this.setRandomWord.bind(this))

    this.buttons.reverse.on('click', this.setReverseMode.bind(this))
    this.buttons.forward.on('click', this.setForwardMode.bind(this))

    this.buttons.play.on('click', this.play.bind(this))
    this.buttons.newGame.on('click', this.reset.bind(this))

    this.buttons.instructions.on('click', this.showTutorial.bind(this))
  }

/* renders an item unclickable */
  makeUnclickable (elem) {
    elem.addClass('unclickable')
  }

/* renders an item clickable */
  makeClickable (elem) {
    elem.removeClass('unclickable')
  }

/* toggle buttons that are clicked */
  switchButtons (clicked, unclicked) {
    this.makeUnclickable(clicked)
    this.makeClickable(unclicked)
    clicked.css('background-color', '#E9E9E9')
    unclicked.css('background-color', 'white')
  }

  /* shows the tutorial */
  showTutorial () {
    this.displays.tutorial.removeClass('hide')
  }

  /* shows the game page */
  showGame () {
    this.displays.welcome.addClass('hide')
    this.displays.tutorial.addClass('hide')
    this.input.addClass('hide')
    this.displays.game.removeClass('hide')
  }

  /* shows the welcome page */
  showWelcome () {
    this.displays.game.addClass('hide')
    this.displays.welcome.removeClass('hide')
  }

  /* shows the custom input box */
  showInput () {
    this.input.removeClass('hide')
  }

  /* hides the custom input box */
  hideInput () {
    this.input.addClass('hide')
  }

  /* Runs if the player made a good guess */
  goodGuess () {
    this.renderGuesses()

    if (this.model.wonGame()) {
      this.playAudio($('.clapping'))
      this.makeUnclickable(this.displays.letter)
    } else {
      this.playAudio($('.cheering'))
    }
  }

  /* Runs if the player made a bad guess */
  badGuess () {
    var doPenalty = this.model.getMode()
    doPenalty(this.hangman)

    if (this.model.lostGame()) {
      this.playAudio($('.decapitation'))
      this.makeUnclickable(this.displays.letter)
      this.model.revealAnswer()
      this.renderGuesses()
    } else {
      this.playAudio($('.torture'))
    }
  }

  /* plays the sound element passed in */
  playAudio (sound) {
    $('audio').trigger('pause').prop('currentTime', reset)
    sound.trigger('play')
  }

/* renders the letter unclickable and updates
 the guesses  */
  handleLetterClick (e) {
    this.makeUnclickable($(e.target))

    if (this.model.checkGuess(e.target.outerText)) {
      this.goodGuess()
    } else {
      this.badGuess()
    }
  }

  /* The mode is set to reverse mode */
  setReverseMode () {
    this.model.setMode('reverse')
    this.hangman.setReverseMode()
    this.switchButtons(this.buttons.reverse, this.buttons.forward)
  }

  /* The mode is set to forward mode */
  setForwardMode () {
    this.model.setMode('forward')
    this.hangman.setForwardMode()
    this.switchButtons(this.buttons.forward, this.buttons.reverse)
  }

  /* Lets the user enter a custom word */
  getCustomWord () {
    this.input.val('')
    this.showInput()
    this.switchButtons(this.buttons.custom, this.buttons.random)
  }

  /* The game chooses a random word for the user */
  setRandomWord () {
    this.hideInput()
    this.switchButtons(this.buttons.random, this.buttons.custom)
    this.input.val(this.model.setRandomWord())
  }

  /* plays the game */
  play () {
    this.model.setWord(this.input.val())
    this.renderGuesses()
    this.showGame()
    this.hangman.resizeCanvas()
  }

/* returns the player to the welcome Screen
    and resets game play
*/
  reset () {
    this.showWelcome()
    this.initGame()
  }

  /* This replaces/adds one underscore on the viewport */
  renderGuess ( {letter, type} ) {
    var $newSpan = $('<span></span>')
    .attr('class', letter.toUpperCase() + ' ' + type)
    .html(letter + ' ')

    this.displays.underscore.append($newSpan)
  }

  /* render the underscores/guessed letters to the viewport */
  renderGuesses () {
    var guesses = this.model.getGuesses()
    console.log(guesses);
    // this.displays.underscore.children('span').empty()
    this.displays.underscore.empty();

    guesses.map((guess) => {
      this.renderGuess(guess)
    })
  }

} // end class

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = WindowView
} else {
  window.WindowView = WindowView
}
