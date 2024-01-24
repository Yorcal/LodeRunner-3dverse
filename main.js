//------------------------------------------------------------------------------
import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
  SCORING_EVENT_MAP_UUID,
  ENTITY_EVENT_MAP_UUID,
} from "./config.js";

//------------------------------------------------------------------------------
window.addEventListener("load", InitApp);

//------------------------------------------------------------------------------
async function InitApp() {
  await SDK3DVerse.joinOrStartSession({
    userToken: publicToken,
    sceneUUID: mainSceneUUID,
    canvas: document.getElementById("display-canvas"),
    createDefaultCamera: false,
    startSimulation: "on-assets-loaded",
  });

  await InitFirstPersonController(characterControllerSceneUUID);

  //SDK3DVerse.engineAPI.scriptNotifier.on(`${SCORING_EVENT_MAP_UUID}/UpdateScore`, (params)  => console.log("UpdateScore event received with params:", params));

  SDK3DVerse.engineAPI.registerToEvent(SCORING_EVENT_MAP_UUID, "UpdateScore", (params) => console.log("Score has been updated : ", params));

  SDK3DVerse.engineAPI.onEnterTrigger( (emiterEntity, triggerEntity) => {
    console.log("hello");
  });

  console.log("Init Finished");

  //document.addEventListener("keydown", onKeyDown);
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
}

/*
async function onKeyDown(event){
  if(event.code === "KeyS"){
    await Raycast();
  }
}

async function Raycast()
{
  const origin = [0,1,0];
  const direction = [0,1,0];
  const rayLength = 20;
  const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.static_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
  
  // Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches
  const { block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, direction, rayLength, filterFlags);

  console.log(block);
  console.log(touches);
}
*/

