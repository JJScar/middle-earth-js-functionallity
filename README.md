# Game State Update Mechanism

## Overview

This module provides a sophisticated game state management system for a multi-agent interaction game. It handles agent movements, positioning, and relationship dynamics within a predefined map.

## Key Concepts

### Inputs
The input objects represented by two primary objects:
- `_gameState`: Contains current information about all agents
  - Includes agent positions
  - Tracks inter-agent relationships
- `_decisions`: Represents agents' intended actions
  - Target positions
  - Desired interactions
  - Target agents

### Map Constraints
- Map Radius: 60 units (Total map diameter: 120 units)
- Agents can only perform actions within map boundaries

## Core Functionality

### Movement Logic
- Agents can move to new positions
- Movement validation includes:
  1. Position within map boundaries
  2. Movement validity (determined by `isValidMovement`)

### Interaction Mechanics
Two primary interaction types:
1. **Alliance Formation**
   - Requires mutual agreement
   - Agents must be within 2 units of each other
   - Prevents duplicate alliance formation

2. **Battle Initiation**
   - Cannot occur between allied agents
   - Requires agents to be within 2 units
   - Prevents duplicate battle declarations

## Helper Functions (Imported)
- `isWithinMap`: Validates position against map boundaries
- `isValidMovement`: Checks movement legitimacy
- `isWithinTwoUnits`: Determines proximity between agents

## Update Process

1. Deep clone existing game state
2. Iterate through all agents
3. Process each agent's:
   - Movement
   - Interaction intentions
4. Update game state accordingly
5. Return modified game state

## Example Scenario

```javascript
// Initial State
const gameState = {
  agentA: { 
    currentPos: {x: 0, y: 0}, 
    relB: 'ignore' 
    relC: 'ignore' 
    relD: 'ignore' 
  },
  agentB: { 
    currentPos: {x: 1, y: 1}, 
    relA: 'ignore' 
    relC: 'ignore' 
    relD: 'ignore' 
  },
  agentC: {
    currentPos: {x: 2, y: 2}
    relA: 'ignore'
    relB: 'ignore' 
    relD: 'ignore' 
  },
  agentD: {
    currentPos: {x: 3, y: 3}
    relA: 'ignore' 
    relB: 'ignore' 
    relC: 'ignore' 
  }
}

// Decisions
const decisions = {
  agentA: { 
    targetPos: {x: 1, y: 1}, 
    interaction: 'alliance', 
    with: 'agentB' 
  },
  agentB: { 
    interaction: 'alliance', 
    with: 'agentA' 
  }
  agentC: {
    interaction: 'ignore'
    with: 'agentD'
  }
  agentD: {
    targetPos: {x: 4, y: 4}
  }
}

// Result: Agents move and form an alliance
```

## Constraints and Considerations
- One-way interactions are not permitted expect for battle as long they are not in an alliance
- Relationship changes for an alliance requires mutual consent
- Movement and interactions are strictly bounded by map and proximity rules

## Potential Improvements
- Canceling an alliance

## Usage

```javascript
const { updateGameState } = require('./gameStateManager');

const newGameState = updateGameState(existingGameState, agentDecisions);
```

## Dependencies
- Custom helper functions for validation
  - `isWithinMap`
  - `isValidMovement`
  - `isWithinTwoUnits`