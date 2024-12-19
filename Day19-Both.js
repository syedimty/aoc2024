let input = `INPUT HERE`.trim();
const MEMO = new Map([["", 1]]); // hold number of paths to key given these patterns

function dfs(steps, target, count = 0) {
  if (MEMO.has(target)) return MEMO.get(target);

  for (let step of steps) {
    if (target.slice(0, step.length) === step)
      count += dfs(steps, target.slice(step.length));
  }

  MEMO.set(target, count);
  return count;
}

function day19(input) {
  let [patterns, designs] = input.split("\n\n").map((s) => s.split(/\n|, /));
  let numberOfPaths = designs.map((design) => dfs(patterns, design));

  console.log('Part1', numberOfPaths.filter(Boolean).length);
  // Part 2
  console.log('Part2', numberOfPaths.reduce((a,b)=>{
    return a + b;
  }, 0));
}

console.log('Day 19')
day19(input)
