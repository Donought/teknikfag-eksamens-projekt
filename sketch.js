function setup() {
  createCanvas(400, 400);
  hurdleQuestion(1, 5, "+", 4);
}

function draw() {
  background(220);
}

function hurdleQuestion(max, min, operator, variables) {
  comp = [];
  for (let i = 1; i < variables + 1; i++) {
    comp.push(round(random(max, min)));
  }

  // Finds the answer to the question
  ans = comp[0];
  for (let i = 1; i < comp.length; i++) {
    if (operator == "+") {
      ans += comp[i];
    }
    if (operator == "-") {
      ans -= comp[i];
    }
    if (operator == "*") {
      ans *= comp[i];
    }
  }
  // Debugging
  /*
print("how many numbers:",comp.length)
print("numbers are:",comp)
print("ans is:",ans)
*/

  // Defines the question as a variable so that it can be displayed.
  // it does this by creating an array with the variables and the the operator
  // and then turning it into a string to be displayed

  txt = [];
  for (let i = 0; i < variables; i++) {
    txt.push(comp[i]);
    txt.push(operator);
  }
  // Variable to hold the string
  strr = "";
  // Removes unnecessary operator
  txt.splice(txt.length + 2, 1, "=");

  // Places content of txt into string
  for (let i = 0; i < txt.length; i++) {
    strr += txt[i];
  }
  // Updates txt for clarity
  txt = strr;
  print(txt + ans);
  return txt, ans;
}
