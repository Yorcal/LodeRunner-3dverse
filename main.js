//------------------------------------------------------------------------------
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
  SCORING_EVENT_MAP_UUID,
  CORE_EVENT_MAP_UUID,
  level_1_UUID,
  level_2_UUID,
  level_3_UUID
} from "./config.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

var counter = document.getElementById("counter");

var levelidx = 1;

//------------------------------------------------------------------------------
async function InitApp() {
  await SDK3DVerse.joinOrStartSession({
    userToken: publicToken,
    sceneUUID: mainSceneUUID,
    canvas: document.getElementById("display-canvas"),
    createDefaultCamera: false,
    startSimulation: "on-assets-loaded",
  });
  
  SDK3DVerse.engineAPI.registerToEvent(SCORING_EVENT_MAP_UUID, "UpdateScore", updateScoreUI);

  SDK3DVerse.engineAPI.registerToEvent(CORE_EVENT_MAP_UUID, "NextLevel", onNextLevel);

  await InitFirstPersonController(characterControllerSceneUUID);

  console.log("Init Finished");
}

//------------------------------------------------------------------------------
async function InitFirstPersonController(charCtlSceneUUID) {
  // To spawn an entity we need to create an EntityTempllate and specify the
  // components we want to attach to it. In this case we only want a scene_ref
  // that points to the character controller scene.
  const playerTemplate = new SDK3DVerse.EntityTemplate();
  playerTemplate.attachComponent("scene_ref", { value: charCtlSceneUUID });

  // Passing null as parent entity will instantiate our new entity at the root
  // of the main scene.
  const parentEntity = null;
  // Setting this option to true will ensure that our entity will be destroyed
  // when the client is disconnected from the session, making sure we don't
  // leave our 'dead' player body behind.
  const deleteOnClientDisconnection = true;
  // We don't want the player to be saved forever in the scene, so we
  // instantiate a transient entity.
  // Note that an entity template can be instantiated multiple times.
  // Each instantiation results in a new entity.
  const playerSceneEntity = await playerTemplate.instantiateTransientEntity(
    "Player",
    parentEntity,
    deleteOnClientDisconnection
  );

  console.log("Player entity instantiated");

  // The character controller scene is setup as having a single entity at its
  // root which is the first person controller itself.
  const firstPersonController = (await playerSceneEntity.getChildren())[0];
  // Look for the first person camera in the children of the controller.
  const children = await firstPersonController.getChildren();
  const firstPersonCamera = children.find((child) =>
    child.isAttached("camera")
  );

  // We need to assign the current client to the first person controller
  // script which is attached to the firstPersonController entity.
  // This allows the script to know which client inputs it should read.
  SDK3DVerse.engineAPI.assignClientToScripts(firstPersonController);

  // Finally set the first person camera as the main camera.
  SDK3DVerse.setMainCamera(firstPersonCamera);

  SDK3DVerse.engineAPI.fireEvent(CORE_EVENT_MAP_UUID, "PlayerSpawned", [], {});
}

function updateScoreUI(params){
  counter.textContent = params.dataObject.CurrentScore + "/" + params.dataObject.GoalScore;
}

async function onNextLevel(params){
  const rootEntities = await SDK3DVerse.engineAPI.getRootEntities();
  const level = rootEntities.find(e => e.getName() === 'level');


  levelidx ++;
  
  var levelUUID;

  switch(levelidx){

    case(2): 
      levelUUID = level_2_UUID;
      break;

    case(3):
      levelUUID = level_3_UUID;
      break;

    default:  
      levelUUID = level_1_UUID;
      levelidx = 0;
      break;
  }

  level.setComponent('scene_ref', { value: levelUUID});
  
  SDK3DVerse.engineAPI.fireEvent(CORE_EVENT_MAP_UUID, "GameStart", [], {});

}