function solveMazePart2(input) {
    // Parse the input into a grid
    const maze = input.trim().split('\n').map(line => line.split(''));

    // Dimensions
    const rows = maze.length;
    const cols = maze[0].length;

    // Directions and their vector representations
    // We'll use directions as indices: 0 = East, 1 = South, 2 = West, 3 = North
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

    // Use Dijkstra's algorithm to find the minimum cost paths.
    // State: (r, c, d)
    // Costs:
    //  - Move forward by 1 tile = cost + 1 (if not a wall)
    //  - Rotate left or right = cost + 1000

    const INF = Number.POSITIVE_INFINITY;
    const dist = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Array(4).fill(INF))
    );

    dist[startX][startY][0] = 0; // start facing East

    // Priority queue: elements are [cost, x, y, d]
    const pq = [[0, startX, startY, 0]];

    function pqPop() {
        // Sort by cost and pop the smallest
        pq.sort((a, b) => a[0] - b[0]);
        return pq.shift();
    }

    function tryRelax(cost, x, y, d) {
        if (cost < dist[x][y][d]) {
            dist[x][y][d] = cost;
            pq.push([cost, x, y, d]);
        }
    }

    // Run Dijkstra to fill dist
    while (pq.length > 0) {
        const [currentCost, x, y, d] = pqPop();
        if (dist[x][y][d] < currentCost) continue;

        // If we reached the end, keep going until we find all shortest dists
        // (We still need the full dist array to do part2)
        // No early return since we need full info for reconstruction.

        // Try moving forward
        const nx = x + directions[d].dx;
        const ny = y + directions[d].dy;
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] !== '#') {
            tryRelax(currentCost + 1, nx, ny, d);
        }

        // Try rotating left
        const leftDir = (d + 3) % 4;
        tryRelax(currentCost + 1000, x, y, leftDir);

        // Try rotating right
        const rightDir = (d + 1) % 4;
        tryRelax(currentCost + 1000, x, y, rightDir);
    }

    // Find the best cost at the end tile in any direction
    let bestCost = INF;
    for (let d = 0; d < 4; d++) {
        if (dist[endX][endY][d] < bestCost) {
            bestCost = dist[endX][endY][d];
        }
    }

    // Now we need to find all tiles that are on any shortest path.
    // We'll do a backward search from all end states (endX, endY, d) where dist is bestCost.
    // We will find all states that lead to these end states with exactly the cost difference
    // required for a shortest path (i.e., if forward move => cost difference of 1,
    // if rotation => cost difference of 1000).

    const onBestPath = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Array(4).fill(false))
    );

    const queue = [];
    // Start from all end directions that achieve bestCost
    for (let d = 0; d < 4; d++) {
        if (dist[endX][endY][d] === bestCost) {
            onBestPath[endX][endY][d] = true;
            queue.push([endX, endY, d]);
        }
    }

    // We'll go backwards:
    // If (x,y,d) is on a best path, what states can lead to (x,y,d)?

    // Forward transitions were:
    // 1) (x,y,d) -> (x+dx[d], y+dy[d], d) with cost+1 if not wall
    // 2) (x,y,d) -> (x,y,(d+3)%4) or (x,y,(d+1)%4) with cost+1000 for rotations

    // Backwards:
    // For a forward move:
    // (nx,ny,d) can come from (nx - dx[d], ny - dy[d], d) if dist[...] = dist[nx][ny][d] - 1
    // For rotations:
    // (x,y,d) can come from (x,y,(d+1)%4) if dist[x][y][(d+1)%4] = dist[x][y][d]-1000
    // (x,y,d) can come from (x,y,(d+3)%4] if dist[x][y][(d+3)%4] = dist[x][y][d]-1000

    while (queue.length > 0) {
        const [x, y, d] = queue.shift();
        const currentDist = dist[x][y][d];

        // Backward step for forward moves:
        // If we came from forward movement, previous position must be (x - dx[d], y - dy[d], d)
        const px = x - directions[d].dx;
        const py = y - directions[d].dy;
        if (px >= 0 && px < rows && py >= 0 && py < cols && maze[px][py] !== '#') {
            // dist[px][py][d] should be currentDist - 1
            if (dist[px][py][d] === currentDist - 1 && !onBestPath[px][py][d]) {
                onBestPath[px][py][d] = true;
                queue.push([px, py, d]);
            }
        }

        // Backward step for rotations:
        // If we ended up at direction d, we could have rotated from (d+1)%4 or (d+3)%4
        const leftFrom = (d + 1) % 4;  // rotating right got us here
        if (dist[x][y][leftFrom] === currentDist - 1000 && !onBestPath[x][y][leftFrom]) {
            onBestPath[x][y][leftFrom] = true;
            queue.push([x, y, leftFrom]);
        }

        const rightFrom = (d + 3) % 4; // rotating left got us here
        if (dist[x][y][rightFrom] === currentDist - 1000 && !onBestPath[x][y][rightFrom]) {
            onBestPath[x][y][rightFrom] = true;
            queue.push([x, y, rightFrom]);
        }
    }

    // Now we have all states (x,y,d) that are part of at least one shortest path.
    // We need to count how many distinct tiles are involved.
    const bestPathTiles = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (let d = 0; d < 4; d++) {
                if (onBestPath[r][c][d]) {
                    // This tile is part of a best path in some direction
                    // Tile must not be a wall
                    if (maze[r][c] !== '#') {
                        bestPathTiles.add(r + ',' + c);
                    }
                    break; // No need to check other directions once one direction qualifies
                }
            }
        }
    }

    return bestPathTiles.size;
}

// Example usage with the first example from the puzzle:
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

console.log(solveMazePart2(input1)); // Should print 45
