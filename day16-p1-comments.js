function solveMaze(input) {
    // Parse the input into a 2D array (grid) representing the maze.
    // Each element of 'maze' is a single character from the input string.
    const maze = input.trim().split('\n').map(line => line.split(''));

    // Get the dimensions of the maze.
    const rows = maze.length;
    const cols = maze[0].length;

    // Define the possible directions and their corresponding movements in (dx, dy).
    // We choose an indexing convention: 0 = East, 1 = South, 2 = West, 3 = North.
    // This will help us rotate easily by adding or subtracting 1 modulo 4.
    const directions = [
        {dx: 0, dy: 1},   // East: move in the column direction positively (right)
        {dx: 1, dy: 0},   // South: move in the row direction positively (down)
        {dx: 0, dy: -1},  // West: move in the column direction negatively (left)
        {dx: -1, dy: 0}   // North: move in the row direction negatively (up)
    ];

    let startX, startY, endX, endY;

    // Locate the start (S) and end (E) positions in the maze.
    // We assume exactly one 'S' and one 'E'.
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

    // We will use a modified Dijkstra's algorithm to find the minimum cost path.
    // State definition: (r, c, dir)
    // - r, c are the current coordinates.
    // - dir is the current facing direction (0=East, 1=South, 2=West, 3=North).
    //
    // Cost rules:
    // - Moving forward into a free cell costs 1.
    // - Rotating left or right in place costs 1000.
    // These costs differ significantly, so paths that require many turns will be very expensive.

    // Initialize a 3D array 'dist' for distances, indexed by [r][c][dir].
    // dist[r][c][dir] will hold the minimum cost to reach cell (r, c) while facing direction 'dir'.
    const INF = Number.POSITIVE_INFINITY;
    const dist = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Array(4).fill(INF)
        )
    );

    // We start at (startX, startY) facing East (direction = 0) with a cost of 0.
    dist[startX][startY][0] = 0;

    // Priority queue (min-heap) for Dijkstra's algorithm. Elements: [cost, x, y, dir].
    // We use a simple array and sort for pop; for large data sets, a proper priority queue would be more efficient.
    const pq = [];
    pq.push([0, startX, startY, 0]);

    // A helper function to pop from the priority queue (returns the element with smallest cost).
    function pqPop() {
        pq.sort((a, b) => a[0] - b[0]);
        return pq.shift();
    }

    // A helper function to relax edges: if we find a cheaper cost to reach (x, y, d), update and push to queue.
    function tryRelax(cost, x, y, d) {
        if (cost < dist[x][y][d]) {
            dist[x][y][d] = cost;
            pq.push([cost, x, y, d]);
        }
    }

    // Run Dijkstra's algorithm until the queue is empty or we reach the end.
    while (pq.length > 0) {
        const [currentCost, x, y, d] = pqPop();

        // If the current state cost is greater than the recorded best cost, skip it.
        // This indicates we've found a better route before.
        if (dist[x][y][d] < currentCost) continue;

        // If we've reached the end cell (E), return the cost.
        // We don't need to consider direction here; we just need to arrive at 'E'.
        if (x === endX && y === endY) {
            return currentCost;
        }

        // 1) Try moving forward in the current direction.
        const nx = x + directions[d].dx;
        const ny = y + directions[d].dy;
        // Check boundaries and ensure the next cell is not a wall ('#').
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] !== '#') {
            // Moving forward costs 1.
            tryRelax(currentCost + 1, nx, ny, d);
        }

        // 2) Try rotating left.
        // Rotating doesn't change position, only direction.
        const leftDir = (d + 3) % 4;  // (d - 1) mod 4
        // Rotation cost is 1000.
        tryRelax(currentCost + 1000, x, y, leftDir);

        // 3) Try rotating right.
        const rightDir = (d + 1) % 4; // (d + 1) mod 4
        // Rotation cost is also 1000.
        tryRelax(currentCost + 1000, x, y, rightDir);
    }

    // If we exhaust the priority queue without reaching E, return -1 indicating no path was found.
    return -1;
}

// Example usage with a given maze input:
const input = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`;

console.log(solveMaze(input)); // Expected output: 7036
