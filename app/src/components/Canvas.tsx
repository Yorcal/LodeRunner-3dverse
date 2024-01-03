'use client';

import Script from 'next/script';

import {
  publicToken,
  mainSceneUUID,
  characterControllerSceneUUID,
} from "./config.js";

export const Canvas = () => {
  const initApp = async () => {
    await SDK3DVerse.joinOrStartSession({
      userToken: publicToken,
      sceneUUID: mainSceneUUID,
      canvas: document.getElementById("display-canvas"),
      createDefaultCamera: false,
      startSimulation: "on-assets-loaded",
    });
  
    await InitFirstPersonController(characterControllerSceneUUID);
    console.log("Init Finished");
  
    SDK3DVerse.engineAPI.onEnterTrigger( (emiterEntity: any, triggerEntity: any) => {
      console.log("hello");
    });
  
    document.addEventListener("keydown", onKeyDown);
    }


    const InitFirstPersonController = async (charCtlSceneUUID: string) => {
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
      const firstPersonCamera = children.find((child: { isAttached: (arg0: string) => any; }) =>
        child.isAttached("camera")
      );
    
      // We need to assign the current client to the first person controller
      // script which is attached to the firstPersonController entity.
      // This allows the script to know which client inputs it should read.
      SDK3DVerse.engineAPI.assignClientToScripts(firstPersonController);
    
      // Finally set the first person camera as the main camera.
      SDK3DVerse.setMainCamera(firstPersonCamera);
    }
    
    const onKeyDown = async (event: { code: string; }) => {
      if(event.code === "KeyS"){
        await Raycast();
      }
      if(event.code === "KeyD"){
        console.log("D");
      }
      if(event.code === "KeyA"){
        console.log("A");
      }
    }

    const Raycast = async () =>
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

  return (
    <>
      <Script
        src='https://cdn.3dverse.com/legacy/sdk/latest/SDK3DVerse.js'
        onLoad={initApp}
      />
      <canvas
        id='display-canvas'
        className='w-screen h-screen'
      >
      </canvas>
    </>
  );
};
