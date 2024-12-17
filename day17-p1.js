function runProgram(registers, program) {
    const REGISTERS = { A: registers[0], B: registers[1], C: registers[2] }; // Initialize registers A, B, and C
    const OUTPUT = [];
    let pointer = 0;
  
    // Function to determine the value of a combo operand
    function getComboValue(operand) {
      if (operand >= 0 && operand <= 3) return operand; // Literal values
      if (operand === 4) return REGISTERS.A;
      if (operand === 5) return REGISTERS.B;
      if (operand === 6) return REGISTERS.C;
      throw new Error("Invalid combo operand 7 encountered.");
    }
  
    // Main execution loop
    while (pointer < program.length) {
      const opcode = program[pointer]; // Current instruction's opcode
      const operand = program[pointer + 1]; // Operand that follows the opcode

      console.log(pointer, opcode, operand)

      switch (opcode) {
        case 0: // adv: Divide A by 2^operand
          REGISTERS.A = Math.trunc(REGISTERS.A / (2 ** getComboValue(operand)));
          break;
  
        case 1: // bxl: XOR B with the literal operand
          REGISTERS.B ^= operand;
          break;
  
        case 2: // bst: Set B to combo operand % 8
          REGISTERS.B = getComboValue(operand) % 8;
          break;
  
        case 3: // jnz: Jump to literal operand if A is not 0
          if (REGISTERS.A !== 0) {
            pointer = operand;
            continue; // Skip the automatic pointer increment
          }
          break;
  
        case 4: // bxc: XOR B with C
          REGISTERS.B ^= REGISTERS.C;
          break;
  
        case 5: // out: Output combo operand % 8
          OUTPUT.push(getComboValue(operand) % 8);
          break;
  
        case 6: // bdv: Divide A by 2^operand and store in B
          REGISTERS.B = Math.trunc(REGISTERS.A / (2 ** getComboValue(operand)));
          break;
  
        case 7: // cdv: Divide A by 2^operand and store in C
          REGISTERS.C = Math.trunc(REGISTERS.A / (2 ** getComboValue(operand)));
          break;
  
        default:
          throw new Error(`Unknown opcode encountered: ${opcode}`);
      }
  
      pointer += 2; // Advance instruction pointer
    }
  
    return OUTPUT.join(",");
  }
  
  // Input setup based on the example
  const registers = [27334280, 0, 0]; // Register A = 729, B = 0, C = 0
  const program = [2,4,1,2,7,5,0,3,1,7,4,1,5,5,3,0]; // Input program
  
  // Execute the program
  const output = runProgram(registers, program);
  console.log("Final Output:", output);
  
