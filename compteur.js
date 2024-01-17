var counter = document.getElementById("counter");
var count = 0;


function incrementCounter() {
  count++;
  counter.textContent = count;
}

var oldConsoleLog = console.log;

console.log = function(message) {
  oldConsoleLog.apply(console, arguments);

  if (message.includes("hello")) {
    incrementCounter();
  }
};
