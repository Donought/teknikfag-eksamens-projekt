function setup() {
  createCanvas(400, 400);
  hurdleQuestion(1,5,3,4,5,100000000)
}

function draw() {
  background(220);
}

function hurdleQuestion(max,min,addition,multipication,negatives,variables){

comp = []

for (let i = 1; i < variables+1; i++) {
comp.push(round(random(max,min)))
}

// Finds the answer to the question 
ans = comp[0]
for (let i = 1; i < comp.length; i++) {
ans += comp[i]
}
// Debugging
/*
print("how many number:",comp.length)
print("numbers are:",comp)
print("ans is:",ans)
*/
// defines the question as a variable so that it can be displayed.
//TBA
}