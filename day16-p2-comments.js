function solveMazePart2(input) {
    // Convert the input string into a 2D array (grid) of characters
    const maze = input.trim().split('\n').map(line => line.split(''));

    // Get the dimensions of the maze grid
    const rows = maze.length;
    const cols = maze[0].length;

    // Define the possible movement directions and their (dx, dy) offsets.
    // Indexing directions as: 0 = East, 1 = South, 2 = West, 3 = North.
    const directions = [
        {dx: 0, dy: 1},   // East: move in y+ direction
        {dx: 1, dy: 0},   // South: move in x+ direction
        {dx: 0, dy: -1},  // West: move in y- direction
        {dx: -1, dy: 0}   // North: move in x- direction
    ];

    let startX, startY, endX, endY;

    // Locate the start ('S') and end ('E') positions in the maze
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze[r][c] === 'S') {
                startX = r;
                startY = c;
            }
            if (maze[r][c] === 'E') {
                endX = r;
                endY = c;
            }
        }
    }

    // We will use a variation of Dijkstra's algorithm for shortest path:
    // States are defined by (x, y, direction).
    // Costs:
    // - Moving forward into a non-wall cell: cost + 1
    // - Rotating left or right (changing direction in place): cost + 1000
    //
    // We keep track of the minimum cost (distance) for each state.

    const INF = Number.POSITIVE_INFINITY;

    // dist[x][y][d] holds the minimum cost to reach cell (x,y) facing direction d
    const dist = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Array(4).fill(INF))
    );

    // Start at (startX, startY) facing East (direction 0) with cost = 0
    dist[startX][startY][0] = 0;

    // Priority queue for Dijkstra: we store [cost, x, y, direction]
    const pq = [[0, startX, startY, 0]];

    // Helper function to pop from the priority queue (smallest cost first)
    function pqPop() {
        pq.sort((a, b) => a[0] - b[0]);
        return pq.shift();
    }

    // Helper function to attempt relaxing (updating) a state if a better cost is found
    function tryRelax(cost, x, y, d) {
        if (cost < dist[x][y][d]) {
            dist[x][y][d] = cost;
            pq.push([cost, x, y, d]);
        }
    }

    // Run Dijkstra until all shortest distances are found
    while (pq.length > 0) {
        const [currentCost, x, y, d] = pqPop();
        // If we have found a cheaper way earlier, skip this outdated entry
        if (dist[x][y][d] < currentCost) continue;

        // We do NOT stop when we first reach the end because we need full shortest-path information
        // for all directions and states, so that we can reconstruct all shortest paths later.

        // Attempt to move forward in the current direction, if not blocked by a wall
        const nx = x + directions[d].dx;
        const ny = y + directions[d].dy;
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] !== '#') {
            tryRelax(currentCost + 1, nx, ny, d);
        }

        // Attempt rotation to the left (turning left in place): cost + 1000
        const leftDir = (d + 3) % 4; // turn left
        tryRelax(currentCost + 1000, x, y, leftDir);

        // Attempt rotation to the right (turning right in place): cost + 1000
        const rightDir = (d + 1) % 4; // turn right
        tryRelax(currentCost + 1000, x, y, rightDir);
    }

    // Find the cheapest cost to reach the end cell (endX, endY) from any direction
    let bestCost = INF;
    for (let d = 0; d < 4; d++) {
        if (dist[endX][endY][d] < bestCost) {
            bestCost = dist[endX][endY][d];
        }
    }

    // After finding the shortest cost, we need to identify all cells that lie on ANY of the shortest paths.
    // We'll do a backward search from the end states (end cell with any direction that yields bestCost).

    // onBestPath[x][y][d] will indicate if state (x,y,d) is part of at least one shortest path
    const onBestPath = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Array(4).fill(false))
    );

    const queue = [];

    // Initialize the queue with all end states (endX, endY, direction) that have the bestCost
    for (let d = 0; d < 4; d++) {
        if (dist[endX][endY][d] === bestCost) {
            onBestPath[endX][endY][d] = true;
            queue.push([endX, endY, d]);
        }
    }

    // Backward reasoning:
    // We know how we got to a state forward, so we reverse it:
    // Forward transitions were:
    // 1) From (x,y,d) -> (x+dx[d], y+dy[d], d) with cost +1
    // 2) From (x,y,d) -> (x,y,(d+1)%4) or (x,y,(d+3)%4) with cost +1000 (rotations)
    //
    // Backwards:
    // If (nx, ny, d) is on a shortest path and was reached by moving forward from (px, py, d),
    // then dist[px][py][d] = dist[nx][ny][d] - 1.
    //
    // If (x,y,d) was reached by rotation from (x,y,dRotated), 
    // then dist[x][y][dRotated] = dist[x][y][d] - 1000.

    while (queue.length > 0) {
        const [x, y, d] = queue.shift();
        const currentDist = dist[x][y][d];

        // Backtrack for a forward move:
        // If we came forward from (px, py, d):
        const px = x - directions[d].dx;
        const py = y - directions[d].dy;
        if (px >= 0 && px < rows && py >= 0 && py < cols && maze[px][py] !== '#') {
            // Check if (px,py,d) leads to (x,y,d) in a shortest path
            if (dist[px][py][d] === currentDist - 1 && !onBestPath[px][py][d]) {
                onBestPath[px][py][d] = true;
                queue.push([px, py, d]);
            }
        }

        // Backtrack for rotations:
        // If current direction is d, we might have rotated from (d+1)%4 (right turn previously)
        // or (d+3)%4 (left turn previously).
        const leftFrom = (d + 1) % 4;  // If we rotated right to arrive here, we started facing leftFrom
        if (dist[x][y][leftFrom] === currentDist - 1000 && !onBestPath[x][y][leftFrom]) {
            onBestPath[x][y][leftFrom] = true;
            queue.push([x, y, leftFrom]);
        }

        const rightFrom = (d + 3) % 4; // If we rotated left to arrive here, we started facing rightFrom
        if (dist[x][y][rightFrom] === currentDist - 1000 && !onBestPath[x][y][rightFrom]) {
            onBestPath[x][y][rightFrom] = true;
            queue.push([x, y, rightFrom]);
        }
    }

    // Now we know which states are on shortest paths. We just need the unique cells involved.
    const bestPathTiles = new Set();

    // Loop over all cells and check if any direction at that cell is on a best path
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (let d = 0; d < 4; d++) {
                if (onBestPath[r][c][d]) {
                    // This cell is part of a shortest path in at least one direction
                    // Ensure the cell is not a wall before adding it.
                    if (maze[r][c] !== '#') {
                        bestPathTiles.add(r + ',' + c);
                    }
                    // Once one direction qualifies, no need to check the others for this cell
                    break;
                }
            }
        }
    }

    // Return how many distinct cells are part of at least one shortest path
    return bestPathTiles.size;
}

// Example usage:
const input1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`;

console.log(solveMazePart2(input1));
