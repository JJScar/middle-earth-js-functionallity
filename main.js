// Mock game state includes 4 agents, their positions, destination of their movement and their intention
// Also has a saved state of the relationships between the agents
const gameState = {
    agents: {
      agentA: {
        position: { x: 0, y: 0 },          // Current position
        destination: null,                 // Destination (null if not moving)
        intention: null,                   // Current intention: 'Attack', 'Alliance', or 'Ignore'
      },
      agentB: {
        position: { x: 2, y: 3 },
        destination: null,
        intention: null,
      },
      agentC: {
        position: { x: 5, y: 1 },
        destination: null,
        intention: null,
      },
      agentD: {
        position: { x: 1, y: 4 },
        destination: null,
        intention: null,
      },
    },
    relationships: {
      // Relationships between agents: 'neutral', 'wanting_alliance', 'allied', 'enemies'
      agentA: { agentB: 'neutral', agentC: 'neutral', agentD: 'neutral' },
      agentB: { agentA: 'neutral', agentC: 'neutral', agentD: 'neutral' },
      agentC: { agentA: 'neutral', agentB: 'neutral', agentD: 'neutral' },
      agentD: { agentA: 'neutral', agentB: 'neutral', agentC: 'neutral' },
    },
  };


function updateGameState(_gameState, _agent, _agentDecision) {
    // => Setup: <= //
    const stateChangeSummary = { movements: [], interactions: [] }; // For return data
    const { destination, action , otherAgent} = _agentDecision; // Agent will pass these params

    // => Checks & Effects: <= //

    // Check that another agent was passed
    if (!otherAgent) {
        throw new Error(`${_agent} specified an invalid target agent: ${otherAgent}`);
      }

    // If there is movement, save the initial and destination positions
    if (destination) {
      const initialPosition = _gameState.agents[_agent].position; // Where the agent is now
      const destinationPosition = destination; // Where the agent wants to go

      const mapRadius = 60; // Diameter is 120, radius is 60
      const distanceFromCenter = Math.sqrt(
        destinationPosition.x ** 2 + destinationPosition.y ** 2
      );
  
      if (distanceFromCenter > mapRadius) {
        throw new Error(`${_agent} tried to move outside the map boundaries.`);
      }

      stateChangeSummary.movements.push({
        agent: _agent,
        initialPosition,
        destinationPosition,
      });
    }
  
    // Save the action (intention)
    if (action) {
        // Calculate distance to the other agent
        const referencePosition = destination ? destinationPosition : _gameState.agents[_agent].position;

        const distance = Math.sqrt(
            (referencePosition.x - _gameState.agents[otherAgent].position.x) ** 2 +
            (referencePosition.y - _gameState.agents[otherAgent].position.y) ** 2
        );

    
        // If within 2 units, check intentions for interaction
        if (distance <= 2) {
          // Handle Alliance
          if ( 
            action === "Alliance" &&
            _gameState.relationships[otherAgent][_agent]=== "wanting_alliance"
          ) {
            stateChangeSummary.interactions.push({
              agents: [_agent, otherAgent],
              type: "allied",
            });
          }
    
          // Handle Wanting Alliance
          else if (action === "Alliance" && _gameState.relationships[otherAgent][_agent] !== "wanting_alliance") {
            stateChangeSummary.interactions.push({
              agents: [_agent],
              type: "wanting_alliance",
            });
          }
    
          // Handle Battle
          if (action === "Attack") {
            stateChangeSummary.interactions.push({
              agents: [_agent, otherAgent],
              type: "battle",
            });
          }
        }
      }
    
  
    // => Return: <= //
    return stateChangeSummary;
  }  

