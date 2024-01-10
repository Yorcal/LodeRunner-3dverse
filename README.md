# Lode Runner On 3DVerse

## Starting Project

Pour React :

cp app

npm i 

npm run dev

## Description

Remake of the Game Lode Runner, findable on the website : https://loderunnerwebgame.com/game/

### Controls

|             | Gamepad        | Mouse/Keyboard |
| ----------- | -------------- | -------------- |
| Move Right  | Left Direction | D              |
| Move Left   | Right Direction| Q              |
| Climb       | Up Direction   | Z              |
| Emote       | Left Trigger   | A              |

## Run it locally

Replace the following values in [config.js](./config.js):

- '%YOUR_PUBLIC_TOKEN%' by the public token of your application found in the "API Access" section.
- '%YOUR_MAIN_SCENE_UUID%' by the UUID of the main scene generated in the Public folder of the "Asset browser" section.
- '%YOUR_CHARACTER_CONTROLLER_SCENE_UUID%' by the UUID of the character controller scene generated in the Public folder of the "Asset browser" section.

The application is a static frontend that can be served by any web server of your convenience.
