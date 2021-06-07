const regEx = /^[a-zA-Z\-]+$/
const randomList = [
  'elephant', 'hangman', 'Mary Poppins', 'awesome', 'charmy', 'mockingbird',
  'The hills are alive with the sound of music', 'Wonder Woman', 'friendly',
  'coffee', 'java', 'washington', 'chocolate ice cream', 'hungry', 'I need food',
  'virginia', 'electronic', 'pie', 'smores', 'jesus', 'I am so tired', 'eggs',
  'I like chocolate milkshakes', 'Are we there yet?', 'Ivory', 'Pajamas', 'Kayak',
  'Apples', 'Happy', 'Covfefe', 'Zombie', 'Banjo', 'doc mcstuffins', 'ouch!',
  'coding is fun', 'flabbergasted', 'This is torture', 'diligence', 'Hot Dog',
  'perserverance', 'appearance', 'languages', 'Goofy', 'Hamburger', 'Money',
  'Feed two birds with one worm'
]

class HangmanModel {

  constructor () {
    this.word = this.getRandomWord()
    this.bodyPartsLength = 0
    this.mode = 'reverse' // default

    this.init()
  }

  init () {
    this.guesses = []
    this.length = 0
    this.incorrectGuesses = 0
    this.correctGuesses = 0
  }

  /*
  sets the length of the number of body parts of
  the hangman
  */
  setBodyPartsLength (length) {
    this.bodyPartsLength = length
  }

  /*
    sets the game mode (reverse or original)
  */
  getMode () {
    if (this.mode === 'reverse') {
      return function (scope) { scope.removeBodyPart() } // default
    } else if (this.mode === 'forward') {
      return function (scope) { scope.addBodyPart() } // default
    }
  }

  setMode (mode) {
    this.mode = mode
  }

  /*
  checks if the guess is in the array and updates
  the guesses array. If not,
  return 0, else return 1
  */
  checkGuess (guess) {
    var index = this.word.indexOf(guess)

    if (index === -1) {
      this.incorrectGuesses += 1
      return 0
    }

    while (index < this.word.length && index !== -1) {
      this.revealLetter(index, this.word[index])
      index++
      index = this.word.indexOf(guess, index)
    }

    return 1
  }

  /* Reveals answer at the end of game  */
  revealAnswer () {
    let index = 0;

    while (index < this.word.length) {
      if ( this.guesses[index].letter !== this.word[index] ) {
        this.guesses[index] = { type: 'bad', letter: this.getType(this.word[index], true) }
      }

      index++
    }
  }


  /*
  updates the guesses array with the letter
  */
  revealLetter (index, letter) {
    this.guesses[index] = { type: 'good', letter: letter }
    this.correctGuesses += 1
  }

  /*
  returns the guesses array
  */
  getGuesses () {
    return this.guesses
  }

  /*
  checks if the user has won the game
  */
  wonGame () {
    return this.correctGuesses === this.length
  }

  /*
  checks if the user has lost the game
  */
  lostGame () {
    return this.incorrectGuesses === this.bodyPartsLength
  }

  getType (elem, answer = false) {
    if (elem.match(regEx)) { 
      return answer ? elem : '_' 
    } else if (elem.match(' ')) {
      return '&nbsp'
    } else {
      return elem
    }
  }

  /*
  sets the word being played and initializes variables
  */
  setWord (word) {
    this.init()

    this.word = word.toUpperCase()
    var wordArray = word.split('')
    this.guesses = []

    this.guesses = wordArray.map((elem) => {
      return { type: 'none', letter: this.getType(elem) }
    })

    var onlyLettersArray = wordArray.filter((elem) => {
      return elem.match(regEx)
    })

    this.length = onlyLettersArray.length
  }

  /* returns a random word from the randomList */
  getRandomWord () {
    var index = Math.floor(Math.random() * randomList.length)

    return randomList[index]
  }

  /* sets the word from the randomList */
  setRandomWord () {
    this.word = this.getRandomWord()
    return this.word
  }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = HangmanModel
} else {
  window.HangmanModel = HangmanModel
}