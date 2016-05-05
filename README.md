##unicorn_game

This is a little javascript and html5 canvas game. This definitely only works in Chrome right now.


To get started you must have node as well as webpack and webpack-dev-server installed globally:

```sh
npm install
webpack --watch
```

In another terminal:
```sh
npm start
```

Go to localhost:8080 and click on app, the game will then start up.

#### Controls
Arrow keys control the movement of the unicorn and spacebar is fire. 

#### Game play
The enemies start in a ramdom spot on the right half of the screen and reorient their direction of motion towards the player every 50 frames. 

Just shoot the enemies, score and lives for the player are up next, maybe a boss of some sort after that.
