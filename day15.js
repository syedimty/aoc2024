#!/usr/bin/env node
log = console.log
// Mock implementations of Grid and Point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    // For usage in sets/maps keys, we can provide a string key
    toKey() {
        return `${this.x},${this.y}`;
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Array(height).fill(null).map(() => new Array(width).fill('.'));
    }

    static fromText(lines) {
        const height = lines.length;
        const width = lines[0].length;
        const g = new Grid(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                g.data[y][x] = lines[y][x];
            }
        }
        return g;
    }

    get(pt) {
        return this.data[pt.y][pt.x];
    }

    set(pt, val) {
        this.data[pt.y][pt.x] = val;
    }

    xyRange() {
        const coords = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                coords.push(new Point(x, y));
            }
        }
        return coords;
    }
}

const DAY_NUM = 15;
const DAY_DESC = 'Day 15: Warehouse Woes';

function calc(log, values, mode) {
    let grid = [];
    let moves = null;

    // Parse the input into grid lines and move lines
    for (const cur of values) {
        if (cur.length === 0) {
            moves = [];
        } else if (moves === null) {
            grid.push(cur);
        } else {
            moves.push(cur);
        }
    }

    // If mode == 2, expand the grid horizontally by doubling certain characters
    if (mode === 2) {
        for (let i = 0; i < grid.length; i++) {
            let line = grid[i];
            let temp = "";
            for (const ch of line) {
                if (ch === '#' || ch === '.') {
                    temp += ch + ch;
                } else if (ch === 'O') {
                    temp += "[]";
                } else if (ch === '@') {
                    temp += "@.";
                } else {
                    throw new Error("Unexpected character in grid");
                }
            }
            grid[i] = temp;
        }
    }

    grid = Grid.fromText(grid);

    // Find robot position '@'
    let robot = null;
    for (const xy of grid.xyRange()) {
        if (grid.get(xy) === '@') {
            robot = new Point(xy.x, xy.y);
            grid.set(xy, '.');
            break;
        }
    }

    // Map of directions
    const dirMap = {
        '^': {x:0, y:-1, up_down:true},
        'v': {x:0, y:1, up_down:true},
        '<': {x:-1, y:0, up_down:false},
        '>': {x:1, y:0, up_down:false}
    };

    for (const row of moves) {
        for (const cur of row) {
            const {x, y, up_down} = dirMap[cur];
            const d = new Point(x, y);
            const to_move = [];
            let empty = 0;

            if (mode === 2 && up_down) {
                let temp = new Point(robot.x, robot.y);
                let linePts = [temp];
                while (true) {
                    let all_empty = true;
                    for (const pt of linePts) {
                        const nextPt = pt.add(d);
                        if (grid.get(nextPt) !== '.') {
                            all_empty = false;
                        }
                    }
                    if (all_empty) {
                        empty += 1;
                        break;
                    }

                    let any_wall = false;
                    for (const pt of linePts) {
                        const nextPt = pt.add(d);
                        if (grid.get(nextPt) === '#') {
                            any_wall = true;
                        }
                    }
                    if (any_wall) {
                        break;
                    }

                    const hit = new Set();
                    for (const pt of linePts) {
                        const nextPt = pt.add(d);
                        const val = grid.get(nextPt);
                        if (val === '[') {
                            hit.add(nextPt.toKey());
                            hit.add(new Point(nextPt.x+1, nextPt.y).toKey());
                        } else if (val === ']') {
                            hit.add(nextPt.toKey());
                            hit.add(new Point(nextPt.x-1, nextPt.y).toKey());
                        } else if (val === 'O') {
                            hit.add(nextPt.toKey());
                        }
                    }

                    linePts = [];
                    for (const k of hit) {
                        const [hx, hy] = k.split(',').map(Number);
                        const hpt = new Point(hx, hy);
                        linePts.push(hpt);
                        to_move.push([hpt, grid.get(hpt)]);
                    }
                    temp = temp.add(d);
                }

            } else {
                let temp = robot.add(d);
                while (true) {
                    const val = grid.get(temp);
                    if (val === '.') {
                        empty += 1;
                        break;
                    } else if (val === 'O') {
                        to_move.push([temp, val]);
                    } else if (val === '[' || val === ']') {
                        to_move.push([temp, val]);
                    } else {
                        break;
                    }
                    temp = temp.add(d);
                }
            }

            if (empty > 0) {
                robot = robot.add(d);
                for (const [pt, _] of to_move) {
                    grid.set(pt, '.');
                }
                for (const [pt, val] of to_move) {
                    grid.set(pt.add(d), val);
                }
            }
        }
    }

    let ret = 0;
    for (const xy of grid.xyRange()) {
        const val = grid.get(xy);
        if (val === 'O' || val === '[') {
            // xy is a Point, xy.x, xy.y
            ret += xy.y * 100 + xy.x;
        }
    }

    return ret;
}

// Mock test environment
function test(log) {
    const values = decodeValues(`
PASTE HERE
    `);

    const res1 = calc(log, values, 1);
    const res2 = calc(log, values, 2);
    log(res1);
    log(res2);
}

function run(log, values) {
    log(calc(log, values, 1));
    log(calc(log, values, 2));
}

// Mock decode_values function
function decodeValues(text) {
    // This function should mimic the log.decode_values in Python code.
    // Here we simply split on newlines and trim whitespace.
    // The input format: blank line separates the grid from the moves.
    const lines = text.trim().split('\n').map(line => line.trim());
    return lines;
}

test(console.log)

// // If this script is run directly, attempt to emulate the Python main
// if (require.main === module) {
//     const fs = require('fs');
//     const path = require('path');

    

    
//     const values = fs.readFileSync(fn, 'utf-8').split('\n').map(line => line.trimEnd());
//     console.log(`Running day ${DAY_DESC}:`);
//     run(console.log, values);
// }
