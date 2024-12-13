const fs = require("fs");

function part1(data) {
    return solve(data, 0);
}

function part2(data) {
    return solve(data, 10 ** 13);
}

function solve(data, offset) {
    const groups = data.join("\n").split("\n\n");
    let total = 0;

    for (const group of groups) {
        const [buttonA, buttonB, buttonP] = group.split("\n");

        const [axStr, ayStr] = buttonA.slice(10).split(", ");
        const [bxStr, byStr] = buttonB.slice(10).split(", ");
        const [pxStr, pyStr] = buttonP.slice(7).split(", ");

        const ax = parseInt(axStr.slice(2));
        const ay = parseInt(ayStr.slice(2));
        const bx = parseInt(bxStr.slice(2));
        const by = parseInt(byStr.slice(2));
        const px = parseInt(pxStr.slice(2)) + offset;
        const py = parseInt(pyStr.slice(2)) + offset;

        // Cramer's rule
        const denominator = (ax * by - ay * bx); // determinant

        if (denominator === 0) {
            continue;
        }

        const m = Math.floor((px * by - py * bx) / denominator);

        if (m * denominator !== (px * by - py * bx)) {
            continue;
        }

        const n = Math.floor((py - ay * m) / by);

        if (n * by !== (py - ay * m)) {
            continue;
        }

        // Diophantine equation with the solutions by Cramer's rule
        total += 3 * m + n;
    }

    return total;
}

function main() {
    let data  = ``.trim().split("\n");


    const startPart1 = performance.now();
    console.log(data)
    const part1Result = part1(data);
    const part1Time = performance.now() - startPart1;
    console.log(`Part 1: ${part1Result} (Time: ${part1Time.toFixed(4)} ms)`);

    const startPart2 = performance.now();
    const part2Result = part2(data);
    const part2Time = performance.now() - startPart2;
    console.log(`Part 2: ${part2Result} (Time: ${part2Time.toFixed(4)} ms)`);
}

main();
