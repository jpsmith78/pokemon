const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){

  this.appName = "Pokemon Fighting Game!";
  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonName = '';
  this.pokemonResult = '';
  this.pokemonStats = [];
  this.pokemonAblilites = [];
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=30"
  this.baseUrl = "https://pokeapi.co/api/v2/pokemon/"

  this.findPokemon = ()=>{
    $http({
      method: 'GET',
      url: this.baseUrl + this.pokemonResult
    }).then(response => {
      console.log(response.data);
        this.pokemonSprites = response.data.sprites.front_default;
        this.pokemonName = response.data.name
        this.pokemonAblilites = [];
        for (var i = 0; i < response.data.abilities.length; i++) {
          this.pokemonAblilites.push(response.data.abilities[i]);
        };
        this.pokemonStats = [];
        for (let j = 0; j < response.data.stats.length; j++){
          this.pokemonStats.push(response.data.stats[j]);
        };
    }, error => {
      console.log(error);
    })
  }

  this.getPokemon = () => {
    $http({
      method: 'GET',
      url: this.pokemonURL
    }).then(response =>{
        console.log(response.data);
        for (let i = 0; i < response.data.results.length; i++) {
          this.pokemonList.push(response.data.results[i].name);
        }
    }, error => {
      console.log(error);
    })
  };

  this.moveNameToInputField = ($event) => {
        this.pokemonResult = $event.target.innerHTML
  };



//end MainController
}]);
