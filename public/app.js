const app = angular.module('MyApp', []);

app.controller('MainController', ['$http', function($http){
  this.appName = "Pokemon Fun Time!"
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=200"
  this.getPokemon = () => {
    $http({
      method: 'GET',
      url: this.pokemonURL
    }).then(response =>{
        console.log(response.data);
    }, error => {
      console.log(error);
    })
  };




}]);
