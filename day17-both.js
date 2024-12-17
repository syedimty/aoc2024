const aI = 27334280
const bI = 0
const cI = 0
const program =  [2,4,1,2,7,5,0,3,1,7,4,1,5,5,3,0]
const output = console.log

const out = [];

let [a, b, c] = [aI, bI, cI];
let ptr = 0;

const run = () => {
  out.length = 0;
  ptr = 0;
  while (program[ptr] != null) {
    instructions[program[ptr]]();
    ptr += 2;
  }
};

const instructions = [
  () => (a = Math.floor(a / (1 << combo()))),
  () => (b = b ^ program[ptr + 1]),
  () => (b = combo() & 7),
  () => a && (ptr = program[ptr + 1] - 2),
  () => (b = b ^ c),
  () => out.push(combo() & 7),
  () => (b = Math.floor(a / (1 << combo()))),
  () => (c = Math.floor(a / (1 << combo()))),
];

const combo = () => [0, 1, 2, 3, a, b, c][program[ptr + 1]];

const findInitialA = (nextVal = 0, i = program.length - 1) => {
  if (i < 0) return nextVal;
  for (let aVal = nextVal * 8; aVal < nextVal * 8 + 8; aVal++) {
    a = aVal;
    run();
    if (out[0] === program[i]) {
      const finalVal = findInitialA(aVal, i - 1);
      if (finalVal >= 0) return finalVal;
    }
  }
  return -1;
};

run();
output('part1', out.join(','));
output('part2', findInitialA());
