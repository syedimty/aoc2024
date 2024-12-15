function simulateWarehouse(warehouse, moves) {
    // Convert warehouse into a mutable 2D array
    const grid = warehouse.map(row => row.split(''));
    const rows = grid.length;
    const cols = rows > 0 ? grid[0].length : 0;

    // Find the robot's initial position
    let robotRow = -1, robotCol = -1;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@') {
                robotRow = r;
                robotCol = c;
                break;
            }
        }
        if (robotRow !== -1) break;
    }

    const dirMap = {
        '^': [-1, 0],
        'v': [1, 0],
        '<': [0, -1],
        '>': [0, 1]
    };

    function inBounds(r, c) {
        return r >= 0 && r < rows && c >= 0 && c < cols;
    }

    for (const move of moves) {
        const [dr, dc] = dirMap[move] || [0, 0];
        const nextR = robotRow + dr;
        const nextC = robotCol + dc;

        // If next position is out of bounds or a wall, skip
        if (!inBounds(nextR, nextC) || grid[nextR][nextC] === '#') {
            continue;
        }

        if (grid[nextR][nextC] === '.') {
            // Move robot into empty space
            grid[robotRow][robotCol] = '.';
            grid[nextR][nextC] = '@';
            robotRow = nextR;
            robotCol = nextC;
        } else if (grid[nextR][nextC] === 'O') {
            // Need to push boxes
            let boxPositions = [];
            let curR = nextR;
            let curC = nextC;
            let canPush = true;
            let finalEmptyR, finalEmptyC;

            while (true) {
                if (!inBounds(curR, curC) || grid[curR][curC] === '#') {
                    // Hit a wall or out of bounds
                    canPush = false;
                    break;
                }
                if (grid[curR][curC] === 'O') {
                    // Add to chain and move forward
                    boxPositions.push([curR, curC]);
                    curR += dr;
                    curC += dc;
                } else {
                    // Must be either '.' or '@'
                    if (grid[curR][curC] === '.') {
                        // Found an empty space to push into
                        finalEmptyR = curR;
                        finalEmptyC = curC;
                        break;
                    } else {
                        // It's not empty space, can't push
                        canPush = false;
                        break;
                    }
                }
            }

            if (canPush && boxPositions.length > 0) {
                // Perform the push
                // Robot leaves original position
                grid[robotRow][robotCol] = '.';

                // Push boxes forward in reverse order
                boxPositions.reverse();

                // Place a box in the final empty spot
                grid[finalEmptyR][finalEmptyC] = 'O';

                // Shift other boxes forward
                for (let i = 0; i < boxPositions.length - 1; i++) {
                    const [rFrom, cFrom] = boxPositions[i];
                    const rTo = rFrom + dr;
                    const cTo = cFrom + dc;
                    grid[rTo][cTo] = 'O';
                }

                // The original position of the last box in the chain becomes empty
                const [firstBoxR, firstBoxC] = boxPositions[boxPositions.length - 1];
                grid[firstBoxR][firstBoxC] = '.';

                // Move the robot into the place where the first box was
                grid[nextR][nextC] = '@';
                robotRow = nextR;
                robotCol = nextC;
            } else {
                // Cannot push, do nothing
                continue;
            }
        }
    }

    // After all moves, sum up the positions of the boxes
    let totalSum = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 'O') {
                // GPS coordinate = 100 * row + column
                totalSum += 100 * r + c;
            }
        }
    }

    return totalSum;
}

// Example usage:
const warehouseMap = ``.split("\n");
console.log(warehouseMap.length)
const moves = ``.split("\n").join("");
const result = simulateWarehouse(warehouseMap, moves);
console.log("Resulting sum of box coordinates:", result);
