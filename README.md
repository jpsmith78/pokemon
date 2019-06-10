# pokemon

[link to live app](https://pokemon-fight-game.herokuapp.com/)

## technologies used
HTML, CSS, JavaScript, mongo, express, angular.js, node.js, mongoose, express-session, bcrypt,

## game overview
This game uses a 3rd party pokemon API to gather and list all contained pokemon data and images. This data is then fed onto the page where the user can select one and view its stats.  If the user is registered and logged in, they can try to catch the selected pokemon with their pokeballs.  Once they have caught at least one pokemin, they can do battle with other users wwho have at least one pokemon.  The battle is a simple compare function that picks a winner based on the current users attack points and the selected opponents defense points. If the user wins, they gain a pokeball and their win categoriy increments.  If they lose, they lose a pokeball and their lose category increments.

## user stories
-user can register and log in.
-display API data on poage and make it so user can select one pokemon form list
-create users table and collections table in database.
-show logged in user's stats and pokemon collection.
-list all other users and collections at bottom of page.
-give users ability to add and delete pokemon to their collections.
-user can select opponet to do batle with.
-modals for win/loss, catch success/fail and login fail.
-pokeballs incement every three minutes until they reach 10.

## approach taken
The first step was extracting the correct data from the third party API and displaying it correctly to the page.  After this was achieved. the next step was to make create and get routes for users and collections and import selected pokemon data into current users collection.
After all users and collections were displayed, a compare function was created to compare the difference between current user attack points and selected opponents defense points.  It then declares a winner and changes the current users stats accordingly.
## problems faced
The main issue faced was getting the user PUT route to work properly.  I put the value of the number to change into a variable and then put made the variable my data value. That made the database update correctly.
## future goals
I would like to utilize more of the API data and add more layers to the game.  Maybe an evolution aspect, items, multiple attacks, or a second kind of currency.
