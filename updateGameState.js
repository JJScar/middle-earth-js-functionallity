const { isWithinMap, isValidMovement, isWithinTwoUnits } = require('./helpers');

/// _gameState holds all the current information on all agents. This includes the current coordinates (x,y), and their current interaction with each agent:
/// agentA = {currentPos: (x, y), relB: ignore, relC: allied, relD: battle}

/// _decisions contains the target tile of the agent and the event they want to emit: ignore, battle, allied and with which agent:
/// agentA = {targetPos: (x, y), event: battle, withAgent: agentB}
const updateGameState = (_gameState, _decisions) => {
  // => Setup <=//
  const newGameState = JSON.parse(JSON.stringify(_gameState)); 
  const mapRadius = 60 // Docs suggest that the diameter of the map is 120 units
  const agents = Object.keys(newGameState)

  // => Helper Functions <=//

  // Update relationship between agents
  const updateRelationship = (agent, targetAgent, relationshipType) => {
    const agentKey = targetAgent.slice(-1); // Extract the last character (e.g., "B" from "agentB")
    newGameState[agent][`rel${agentKey}`] = relationshipType;

    const targetKey = agent.slice(-1); // Extract the last character (e.g., "A" from "agentA")
    newGameState[targetAgent][`rel${targetKey}`] = relationshipType;
  }

  // => Checks & Effects: Movements <= //

  agents.forEach((agent) => {
    const currentAgentState = newGameState[agent]
    const decision = _decisions[agent]
    const {targetPos, interaction, with: targetAgent} = decision

    // Handling Movement //
    // If the agent passed a new position, is within the map and is valid we update new state
    if (targetPos && isWithinMap(mapRadius, targetPos) && isValidMovement(currentAgentState.currentPos, targetPos)){
      newGameState[agent].currentPos = targetPos
    }

    // @note we need to make sure that we check the alliance is valid after movement. So when checking alliances need to make sure that the new position is valid not current

    // Handling Interactions //
    // Making sure agent passed a desired interaction and a targetAgent
    if (interaction && targetAgent){
      const targetAgentDecision = _decisions[targetAgent]
      const targetAgentState = newGameState[targetAgent]
      // Alliance Scenario
      const targetAgentKey = targetAgent.slice(-1); // Extract the last character (e.g., "B" from "agentB")
      if (interaction === "alliance" && newGameState[agent][`rel${targetAgentKey}`] !== "alliance"){ // Checking for wanting alliance and that they are not already allied
        if (targetAgentDecision?.interaction === "alliance" && targetAgentDecision?.with === agent && isWithinTwoUnits(targetPos, targetAgentDecision?.targetPos) && isValidMovement(targetPos, targetAgentDecision?.targetPos)){
          updateRelationship(agent, targetAgent, "alliance")
        }
      }

      if (interaction === "battle" && newGameState[agent][`rel${targetAgentKey}`] !== "battle"){ // Checking for wanting battle and that they are not already battling
        if (newGameState[agent][`rel${targetAgentKey}`] !== "alliance" && isWithinTwoUnits(targetPos, targetAgentDecision?.targetPos)){
          updateRelationship(agent, targetAgent, "battle")
        }
      }
    }
  });

  // => Return <=//
  return newGameState
}  

module.exports = { updateGameState };