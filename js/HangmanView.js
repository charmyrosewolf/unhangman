/* global $ */

class HangmanView {
  constructor (model) {
    this.model = model
    this.hangman = $('.hangman')
    this.canvas = $('<canvas></canvas>')
    this.bodyParts = []
    this.currentBodyParts = []

    this.resetDimensions()
    this.listen()
    this.initVariables()
  }

  initVariables () {
    // gallows
    this.gallowsColor = '#A0522D'
    this.gallowXStart = 0
    this.platFormYOffset = (this.height / 10)
    this.platformYStart = this.height - this.platFormYOffset
    this.platFormThickness = this.height / 15
    this.gallowThickness = this.width / 25
    this.topYOffset = this.height / 1.1
    this.topYStart = this.height - this.topYOffset
    this.topLength = this.width / 1.2

    // stool
    this.stoolColor = '#A0522D'
    this.stoolLegWidth = this.width / 30
    this.stoolLegHeight = this.height / 10
    this.stoolWidth = this.width / 5
    this.stoolHeight = this.height / 30

    this.stoolXOffset = (this.width / 2)
    this.stoolYOffset = (this.height / 5)
    this.stoolXStart = this.width - this.stoolXOffset
    this.stoolYStart = this.height - this.stoolYOffset

    this.rightStoolLegX = this.stoolXStart + this.stoolWidth - this.stoolLegWidth

    // body
    this.bodyThickness = 3
    this.bodyColor = 'green'
    this.bodyX = this.stoolXStart + this.stoolWidth / 2
    this.bodyYStart = this.height / 2.7
    this.bodyYEnd = this.height / 1.6

    // limbs
    this.limbColor = 'black'
    this.leftLimbX = this.stoolXStart + this.stoolLegWidth
    this.rightLimbX = this.rightStoolLegX

    this.legYStart = this.height / 1.6
    this.legYEnd = this.stoolYStart
    this.armYStart = this.bodyYStart + (this.bodyYEnd - this.bodyYStart) / 10
    this.armYEnd = this.height / 1.9

    // face
    this.headRadius = this.width / 14
    this.headX = this.bodyX
    this.headY = this.height / 3.22

    this.leftEyeX = this.headX - (this.headRadius / 4)
    this.rightEyeX = this.headX + (this.headRadius / 2)
    this.eyeY = this.headY - (this.headRadius / 3)
    this.eyeRadius = this.headRadius / 9

    this.mouthStartX = this.headX + (this.headRadius / 6)
    this.mouthStartY = this.headY + (this.headRadius / 2)
    this.mouthRadius = this.headRadius / 5
    this.mouthAngleStart = 270
    this.mouthAngleEnd = 90

    // rope
    this.ropeColor = '#D2B48C'
    this.ropeThickness = 5
    this.ropeStartX = this.stoolXStart + (this.stoolWidth / 2)
    this.ropeStartY = this.topYStart
    this.ropeLength = this.height / 5

    this.nooseStartX = this.headX
    this.nooseStartY = this.headY + 4
    this.nooseRadius = this.headRadius
    this.nooseAngleStart = 90
    this.nooseAngleEnd = 270
  }

  initHangman () {
    var self = this

    this.hangman.empty()

    this.bodyParts = []
    this.currentBodyParts = []

    this.bodyParts.push(function () { self.drawStool() })
    this.bodyParts.push(function () { self.drawRope() })
    this.bodyParts.push(function () { self.drawFace() })
    this.bodyParts.push(function () { self.drawMouth() })
    this.bodyParts.push(function () { self.drawLeftEye() })
    this.bodyParts.push(function () { self.drawRightEye() })
    this.bodyParts.push(function () { self.drawBody() })
    this.bodyParts.push(function () { self.drawLeftLeg() })
    this.bodyParts.push(function () { self.drawRightLeg() })
    this.bodyParts.push(function () { self.drawRightArm() })
    this.bodyParts.push(function () { self.drawLeftArm() })

    this.model.setBodyPartsLength(this.bodyParts.length)
  }

  setReverseMode () {
    this.currentBodyParts = this.bodyParts.slice()
  }

  setForwardMode () {
    this.currentBodyParts = []
  }

  listen () {
    $(window).resize(this.resizeCanvas.bind(this))
  }

  resizeCanvas () {
    this.resetDimensions()
    this.initVariables()
    this.draw()
  }

  setDimensions () {
    this.width = parseInt($(this.hangman).css('width'))
    this.height = parseInt($(this.hangman).css('height'))
  }

  resetDimensions () {
    this.canvas.empty()

    this.canvas.attr('width', 0)
    this.canvas.attr('height', 0)

    this.setDimensions()

    this.canvas.attr('width', this.width)
    this.canvas.attr('height', this.height)
  }

  removeBodyPart () {
    this.currentBodyParts.pop()
    this.draw()
  }

  addBodyPart () {
    var fn = this.bodyParts.shift()
    this.currentBodyParts.push(fn)
    this.draw()
  }

  draw () {
    this.resetDimensions()

    this.drawGallow()

    for (var i = 0; i < this.currentBodyParts.length; i++) {
      this.currentBodyParts[i]()
    }

    this.hangman.append(this.canvas)
  }

  drawRope () {
    this.drawRectangle(
      this.ropeColor,
      this.ropeStartX,
      this.ropeStartY,
      this.ropeThickness,
      this.ropeLength
    )
  }

  drawMouth () {
    this.drawArc(
      this.limbColor,
      this.bodyThickness,
      this.mouthStartX,
      this.mouthStartY,
      this.mouthRadius,
      this.mouthAngleStart,
      this.mouthAngleEnd
    )
  }

  drawRightEye () {
    this.drawCircle(
      this.limbColor,
      this.bodyThickness,
      this.rightEyeX,
      this.eyeY,
      this.eyeRadius,
      this.limbColor
    )
  }

  drawLeftEye () {
    this.drawCircle(
      this.limbColor,
      this.bodyThickness,
      this.leftEyeX,
      this.eyeY,
      this.eyeRadius,
      this.limbColor
    )
  }

  drawFace () {
    this.drawCircle(
      this.limbColor,
      this.bodyThickness,
      this.headX,
      this.headY,
      this.headRadius
    )

    this.drawArc(
      this.ropeColor,
      this.ropeThickness,
      this.nooseStartX,
      this.nooseStartY,
      this.nooseRadius,
      this.nooseAngleStart,
      this.nooseAngleEnd
    )
  }

  drawBody () {
    this.drawRectangle(
      this.bodyColor,
      this.stoolXStart,
      this.bodyYStart,
      this.stoolWidth,
      this.height / 3.5
    )
  }

  drawLeftArm () {
    this.drawLimb(
      this.limbColor,
      this.bodyThickness,
      this.leftLimbX,
      this.armYStart,
      this.leftLimbX,
      this.armYEnd)
  }

  drawRightArm () {
    this.drawLimb(
      this.limbColor,
      this.bodyThickness,
      this.rightLimbX,
      this.armYStart,
      this.rightLimbX,
      this.armYEnd)
  }

  drawLeftLeg () {
      // leg
    this.drawLimb(
      this.limbColor,
      this.bodyThickness,
      this.leftLimbX,
      this.legYStart,
      this.leftLimbX,
      this.legYEnd)
  }

  drawRightLeg () {
      // leg

    this.drawLimb(
      this.limbColor,
      this.bodyThickness,
      this.rightLimbX,
      this.legYStart,
      this.rightLimbX,
      this.legYEnd)
  }

  drawStool () {
    // left leg
    this.drawRectangle(
      this.stoolColor,
      this.stoolXStart,
      this.stoolYStart,
      this.stoolLegWidth,
      this.stoolLegHeight
    )

    // right leg
    this.drawRectangle(
      this.stoolColor,
      this.rightStoolLegX,
      this.stoolYStart,
      this.stoolLegWidth,
      this.stoolLegHeight
    )

    // top
    this.drawRectangle(
      this.stoolColor,
      this.stoolXStart,
      this.stoolYStart,
      this.stoolWidth,
      this.stoolHeight
    )
  }

  drawGallow () {
    // platform
    this.drawRectangle(
      this.gallowsColor,
      this.gallowXStart,
      this.platformYStart,
      this.width,
      this.platFormThickness
    )
    // side
    this.drawRectangle(
      this.gallowsColor,
      this.gallowXStart,
      0,
      this.gallowThickness,
      this.height
    )
    // top
    this.drawRectangle(
      this.gallowsColor,
      0,
      this.topYStart,
      this.topLength,
      this.gallowThickness)
  }

  drawRectangle (fill, startX, startY, w, h) {
    var properties = {
      fillStyle: fill,
      // strokeStyle: 'brown',
      // strokeWidth: 0,
      x: startX,
      y: startY,
      fromCenter: false,
      width: w,
      height: h
    }

    this.canvas.drawRect(properties)
  }

  drawCircle (strokeColor, thickness, startX, startY, r, fill = 'white') {
    var properties = {
      strokeStyle: strokeColor,
      fillStyle: fill,
      strokeWidth: thickness,
      x: startX,
      y: startY,
      radius: r
    }

    this.canvas.drawArc(properties)
  }

  drawArc (strokeColor, thickness, startX, startY, r, s, e) {
    var properties = {
      strokeStyle: strokeColor,
      strokeWidth: thickness,
      x: startX,
      y: startY,
      radius: r,
      start: s,
      end: e
    }

    this.canvas.drawArc(properties)
  }

  drawLimb (color, thickness, startX, startY, endX, endY) {
    var properties = {
      strokeStyle: color,
      strokeWidth: thickness,
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY
    }

    this.canvas.drawLine(properties)
  }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = HangmanView
} else {
  window.HangmanView = HangmanView
}
