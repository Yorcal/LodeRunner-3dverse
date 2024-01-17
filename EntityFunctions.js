import {
    ENTITY_EVENT_MAP_UUID,
} from "./config.js";

export function DesactivateBlock(params){

    entity = params.dataObject.Entity;

    //detach mesh
    entity.detachComponent('box_geometry');

    //hide 
    entity.setVisibility(false);

    SDK3DVerse.EngineAPI.fireEvent(ENTITY_EVENT_MAP_UUID,'OnDesactivate', [entity], {currentScore : 1 });
}

export function ActivateBlock(params){

    entity = params.dataObject.Entity;
    
    //detach mesh
    entity.attachComponent('box_geometry');

    //detach geometry
    entity.setVisibility(true);

}