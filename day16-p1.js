function solveMaze(input) {
    // Parse the input into a grid
    const maze = input.trim().split('\n').map(line => line.split(''));

    // Dimensions
    const rows = maze.length;
    const cols = maze[0].length;

    // Directions and their vector representations
    // We'll use 0 = East, 1 = South, 2 = West, 3 = North for convenience
    const directions = [
        {dx: 0, dy: 1},   // East
        {dx: 1, dy: 0},   // South
        {dx: 0, dy: -1},  // West
        {dx: -1, dy: 0}   // North
    ];

    let startX, startY, endX, endY;

    // Find the start (S) and end (E) coordinates
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

    // We will use Dijkstra's algorithm (a priority queue) to find the minimum cost path.
    // State: (row, col, direction)
    // Costs:
    //  - Move forward by 1 tile = 1 point, if not a wall.
    //  - Rotate left or right = 1000 points (no change in position).

    // Initialize a distance map: distance[r][c][dir]
    // We'll store the minimum cost found so far for (r, c, dir)
    const INF = Number.POSITIVE_INFINITY;
    const dist = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Array(4).fill(INF)
        )
    );

    // Starting state: facing East (direction = 0) at (startX, startY)
    dist[startX][startY][0] = 0;

    // Priority queue for Dijkstra (min-heap)
    // We'll store elements as [cost, row, col, direction]
    const pq = [];
    pq.push([0, startX, startY, 0]);

    // A simple binary heap based priority queue implementation
    function pqPop() {
        // Remove and return the element with the smallest cost
        pq.sort((a, b) => a[0] - b[0]);
        return pq.shift();
    }

    function tryRelax(cost, x, y, d) {
        if (cost < dist[x][y][d]) {
            dist[x][y][d] = cost;
            pq.push([cost, x, y, d]);
        }
    }

    // Dijkstra
    while (pq.length > 0) {
        const [currentCost, x, y, d] = pqPop();

        // If this state is no longer optimal, skip it
        if (dist[x][y][d] < currentCost) continue;

        // Check if we reached the end. If yes, we can return the cost (minimum cost for reaching E in any direction)
        if (x === endX && y === endY) {
            return currentCost;
        }

        // 1) Try moving forward
        const nx = x + directions[d].dx;
        const ny = y + directions[d].dy;
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] !== '#') {
            // Move forward cost = currentCost + 1
            tryRelax(currentCost + 1, nx, ny, d);
        }

        // 2) Try rotating left (d-1 mod 4)
        const leftDir = (d + 3) % 4;
        tryRelax(currentCost + 1000, x, y, leftDir);

        // 3) Try rotating right (d+1 mod 4)
        const rightDir = (d + 1) % 4;
        tryRelax(currentCost + 1000, x, y, rightDir);
    }

    // If we exit the loop without returning, it means we couldn't reach E
    return -1;
}

// Example usage:
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

console.log(solveMaze(input)); // Should print 7036 for the given example
