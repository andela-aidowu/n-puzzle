'use strict';

var endTime,
    startTime,
    counted = 0,
    counter = 1000,
    allSuc = [],
    hash = {};

var goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function move(state, successors, pos, steps) {
  var _state, newState;
  newState = state.slice();
  swap(newState, pos, pos + steps);
  if (!compare(newState, state.prev)) {
    _state = hashState(newState);
    if (typeof hash[_state] === 'undefined') {
      hash[_state] = newState;
      newState.prev = state;
      successors.push(newState);
    }
  }
}

function hashState(state) {
    var stateLength = state.length;
    var hash = 0;
    for(var i = 0; i < stateLength; i++) {
        hash += state[i] * Math.pow(stateLength, i);
    }
    return hash;
}

function getSuccessors(state) {
  var successors = [];
  var pos = state.indexOf(0);
  var row = Math.floor(pos / 3);
  var col = pos % 3;
  if (row > 0) {
    //move up
    move(state, successors, pos, -3);
  }
  if (col > 0) {
    //move left
    move(state, successors, pos, -1);
  }
  if (row < 2) {
    //move down
    move(state, successors, pos, 3);
  }
  if (col < 2) {
    //move right
    move(state, successors, pos, 1);
  }
  return successors;
}

function swap(state, from, to) {
  var _ = state[from];
  state[from] = state[to];
  state[to] = _;
}

function statesPerSecond() {
  var now = new Date();
  if (now.getTime() - startTime.getTime() >= counter) {
    console.log('counted', counter, allSuc.length - counted);
    counted = allSuc.length;
    counter += 1000;
  }
}

function collateStates(i) {
  var _ = allSuc[i].prev;
  var result = [allSuc[i]];
  while (_) {
    for (var j = 0; j < allSuc.length; j++) {
      if (compare(_, allSuc[j])) {
        _ = allSuc[j].prev;
        result.push(allSuc[j]);
        break;
      }
    }
  }
  console.log(allSuc.length);
  return result.reverse();
}

function breadthFirstSearch(state, goalState) {
  state.prev = null;
  allSuc.push(state);
  allSuc.push.apply(allSuc, getSuccessors(state));
  for (var i = 1; i < allSuc.length; i++) {
    statesPerSecond();
    if (compare(goalState, allSuc[i])) {
      return collateStates(i);
    } else {
      allSuc.push.apply(allSuc, getSuccessors(allSuc[i]));
    }
  }
}

function compare(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

/* This post on stackexchange explained the condition when a puzzle
   is unsolvable http://math.stackexchange.com/a/838818
*/
function checkSolvable(state) {
  var pos = state.indexOf(0);
  var _state = state.slice();
  _state.splice(pos,1);
  var count = 0;
  for (var i = 0; i < _state.length; i++) {
    for (var j = i + 1; j < _state.length; j++) {
      if (_state[i] > _state[j]) {
        count++;
      }
    }
  }
  return count % 2 === 0;
}

function generatePuzzle() {
  var arr = [];
  while(arr.length < 9){
    var randomNumber = Math.floor(Math.random()*9);
    var found = false;
    for(var i = 0; i < arr.length; i++){
      if(arr[i] === randomNumber){
        found = true;
        break;
      }
    }
    if(!found) {
      arr[arr.length] = randomNumber;
    }
  }
  if(!checkSolvable(arr)) {
    console.log('\n This puzzle: ' + arr + ' is unsolvable. \n Generating a new one \n');
    return generatePuzzle();
  }
  return [8,6,7,2,5,4,3,0,1];
}

function time() {
  startTime = new Date();
  var puzzle = generatePuzzle();
  console.log('Puzzle to solve', puzzle);
  var result = breadthFirstSearch(puzzle, goalState);
  console.log(result.length);
  endTime = new Date();
  console.log('Operation took ' + (endTime.getTime() - startTime.getTime()) + ' msec');
}

time();
