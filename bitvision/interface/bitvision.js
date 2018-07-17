// GLOBALS
"use strict"

let blessed = require('blessed')
let contrib = require('blessed-contrib')

let screen = blessed.screen()

function getRandomInteger(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

// TESTING DATA

let exchangeRateSeries = {
  title: "Exchange Rate",
  x: [...Array(24).keys()].map((key) => {
    return String(key) + ":00"
  }),
  y: [...Array(24).keys()].map((key) => {
    return key * getRandomInteger(1000, 1200)
  })
}

// LAYOUT AND WIDGETS

var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})

// Place tables on the left side of the screen.

var headlineTable = grid.set(0, 0, 4, 4, contrib.table,
  { keys: true
    , fg: 'green'
    , label: 'Headlines'
    , columnSpacing: 1
    , columnWidth: [24, 10, 10]})

var technicalTable = grid.set(4, 0, 4, 4, contrib.table,
  { keys: true
    , fg: 'green'
    , label: 'Technical Indicators'
    , columnSpacing: 1
    , columnWidth: [24, 10, 10]})

var networkTable = grid.set(8, 0, 4, 4, contrib.table,
  { keys: true
    , fg: 'green'
    , label: 'Network Indicators'
    , columnSpacing: 1
    , columnWidth: [24, 10, 10]})

// Line chart on the right of the tables
var exchangeRateCurve = grid.set(0, 4, 6, 6, contrib.line, {
      style: {
        line: "yellow",
        text: "green",
        baseline: "black"
      },
      xLabelPadding: 3,
      xPadding: 5,
      showLegend: true,
      wholeNumbersOnly: false,
      label: "Exchange Rate"
    })

function setLineData(mockData, line) {
  for (var i=0; i<mockData.length; i++) {
    var last = mockData[i].y[mockData[i].y.length-1]
    mockData[i].y.shift()
    var num = Math.max(last + Math.round(Math.random()*10) - 5, 10)
    mockData[i].y.push(num)
  }

  line.setData(mockData)
}

setLineData([exchangeRateSeries], exchangeRateCurve)

setInterval(function() {
   setLineData([exchangeRateSeries], exchangeRateCurve)
   screen.render()
}, 500)

// Quit functionality
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Resizing
screen.on('resize', function() {
  technicalTable.emit('attach');
  networkTable.emit('attach');
  headlineTable.emit('attach');
  exchangeRateCurve.emit('attach');
});

screen.render()