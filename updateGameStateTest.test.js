const { updateGameState } = require('./updateGameState.js'); 


// Mock dependencies if necessary
jest.mock('./helpers', () => ({
    isWithinMap: jest.fn(),
    isValidMovement: jest.fn(),
    isWithinTwoUnits: jest.fn(),
}));

const { isWithinMap, isValidMovement, isWithinTwoUnits } = require('./helpers');

describe('updateGameState with 4 agents', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls before each test
  });

  it('should correctly update all agent positions when valid', () => {
    // Mock helper function behaviors
    isWithinMap.mockReturnValue(true);
    isValidMovement.mockReturnValue(true);

    // Initial state of agents
    const initialGameState = {
      agentA: { currentPos: { x: 0, y: 0 }, relB: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentB: { currentPos: { x: 1, y: 1 }, relA: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentC: { currentPos: { x: 2, y: 2 }, relA: 'ignore', relB: 'ignore', relD: 'ignore' },
      agentD: { currentPos: { x: 3, y: 3 }, relA: 'ignore', relB: 'ignore', relC: 'ignore' },
    };

    // Decisions for all agents
    const decisions = {
      agentA: { targetPos: { x: 1, y: 0 }, interaction: 'ignore', with: 'agentB'},
      agentB: { targetPos: { x: 2, y: 1 }, interaction: 'ignore', with: 'agentA' },
      agentC: { targetPos: { x: 3, y: 2 }, interaction: 'ignore', with: 'agentD' },
      agentD: { targetPos: { x: 4, y: 3 }, interaction: 'ignore', with: 'agentC' },
    };

    // Call the function
    const newGameState = updateGameState(initialGameState, decisions);

    // Assert that positions are updated correctly
    expect(newGameState.agentA.currentPos).toEqual({ x: 1, y: 0 });
    expect(newGameState.agentB.currentPos).toEqual({ x: 2, y: 1 });
    expect(newGameState.agentC.currentPos).toEqual({ x: 3, y: 2 });
    expect(newGameState.agentD.currentPos).toEqual({ x: 4, y: 3 });

    // Assert that helper functions were called for each agent
    expect(isWithinMap).toHaveBeenCalledTimes(4); // Called for each agent
    expect(isValidMovement).toHaveBeenCalledTimes(4); // Called for each agent
  });

  it('should not update positions if movements are invalid for any agent', () => {
    // Mock helper functions: Movement invalid for agentC
    isWithinMap.mockImplementation((_, position) => position.x < 60);
    isValidMovement.mockImplementation((currentPos, targetPos) => {
      return Math.abs(targetPos.x - currentPos.x) <= 1 && Math.abs(targetPos.y - currentPos.y) <= 1;
    });

    // Initial state of agents
    const initialGameState = {
      agentA: { currentPos: { x: 0, y: 0 }, relB: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentB: { currentPos: { x: 1, y: 1 }, relA: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentC: { currentPos: { x: 2, y: 2 }, relA: 'ignore', relB: 'ignore', relD: 'ignore' },
      agentD: { currentPos: { x: 3, y: 3 }, relA: 'ignore', relB: 'ignore', relC: 'ignore' },
    };

    const decisions = {
      agentA: { targetPos: { x: 1, y: 0 }, interaction: 'ignore', with: 'agentB'},
      agentB: { targetPos: { x: 2, y: 1 }, interaction: 'ignore', with: 'agentB'},
      agentC: { targetPos: { x: 61, y: 61 }, interaction: 'ignore', with: 'agentB' }, // Invalid move
      agentD: { targetPos: { x: 4, y: 3 }, interaction: 'ignore', with: 'agentB' },
    };

    // Call the function
    const newGameState = updateGameState(initialGameState, decisions);

    // Assert that valid positions are updated, invalid ones remain unchanged
    expect(newGameState.agentA.currentPos).toEqual({ x: 1, y: 0 });
    expect(newGameState.agentB.currentPos).toEqual({ x: 2, y: 1 });
    expect(newGameState.agentC.currentPos).toEqual({ x: 2, y: 2 }); // No update for invalid move
    expect(newGameState.agentD.currentPos).toEqual({ x: 4, y: 3 });
  });

  it('should correctly handle alliances between agents', () => {
    // Mock proximity check for alliance
    isWithinTwoUnits.mockReturnValue(true);

    const initialGameState = {
      agentA: { currentPos: { x: 0, y: 0 }, relB: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentB: { currentPos: { x: 1, y: 1 }, relA: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentC: { currentPos: { x: 2, y: 2 }, relA: 'ignore', relB: 'ignore', relD: 'ignore' },
      agentD: { currentPos: { x: 3, y: 3 }, relA: 'ignore', relB: 'ignore', relC: 'ignore' },
    };

    const decisions = {
      agentA: { targetPos: { x: 0, y: 0 }, interaction: 'alliance', with: 'agentB' },
      agentB: { targetPos: { x: 1, y: 1 }, interaction: 'alliance', with: 'agentA' },
      agentC: { targetPos: { x: 2, y: 2 }, interaction: 'alliance', with: 'agentD' },
      agentD: { targetPos: { x: 3, y: 3 }, interaction: 'alliance', with: 'agentC' },
    };

    const newGameState = updateGameState(initialGameState, decisions);

    // Assert that alliances are updated
    expect(newGameState.agentA.relB).toBe('alliance');
    expect(newGameState.agentB.relA).toBe('alliance');
    expect(newGameState.agentC.relD).toBe('alliance');
    expect(newGameState.agentD.relC).toBe('alliance');

    // Assert proximity check was called for each pair of agents
    expect(isWithinTwoUnits).toHaveBeenCalledTimes(2); // Called for agentA <-> agentB and agentC <-> agentD
  });

  it('should correctly handle battles between agents', () => {
    // Mock proximity check for battle
    isWithinTwoUnits.mockReturnValue(true);

    const initialGameState = {
      agentA: { currentPos: { x: 0, y: 0 }, relB: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentB: { currentPos: { x: 1, y: 1 }, relA: 'ignore', relC: 'ignore', relD: 'ignore' },
      agentC: { currentPos: { x: 2, y: 2 }, relA: 'ignore', relB: 'ignore', relD: 'ignore' },
      agentD: { currentPos: { x: 3, y: 3 }, relA: 'ignore', relB: 'ignore', relC: 'ignore' },
    };

    const decisions = {
      agentA: { interaction: 'battle', with: 'agentB' },
      agentB: { interaction: 'ignore', with: null },
      agentC: { interaction: 'battle', with: 'agentD' },
      agentD: { interaction: 'ignore', with: null },
    };

    const newGameState = updateGameState(initialGameState, decisions);

    // Assert that battles are updated
    expect(newGameState.agentA.relB).toBe('battle');
    expect(newGameState.agentB.relA).toBe('battle');
    expect(newGameState.agentC.relD).toBe('battle');
    expect(newGameState.agentD.relC).toBe('battle');

    // Assert proximity check was called for each pair of agents
    expect(isWithinTwoUnits).toHaveBeenCalledTimes(2); // Called for agentA <-> agentB and agentC <-> agentD
  });
});

// @note do more tests!
