const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){

  this.appName = "Pokemon Fighting Game!";
  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonName = '';
  this.pokemonResult = '';
  this.pokemonStats = [];
  this.pokemonAblilites = [];
  this.myCards = [];
  this.varDup = ''
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=964"
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

  this.buyPokemon = () => {
    let newCard = angular.element(document.getElementsByClassName("myCards"));
    if (this.pokemonAblilites[2]){
      newCard.append('<div class="myCard"><h1>'+this.pokemonName+'</h1><img src="'+this.pokemonSprites+'" alt="'+this.pokemonName+'"/><h3>Abilities</h3><ul class="myAbilities"><li>'+this.pokemonAblilites[0].ability.name+'</li><li>'+this.pokemonAblilites[1].ability.name+'</li><li>'+this.pokemonAblilites[2].ability.name+'</li></ul><h3>Stats</h3><ul class="myStats"><li>'+this.pokemonStats[0].stat.name+': '+this.pokemonStats[0].base_stat+'</li><li>'+this.pokemonStats[1].stat.name+': '+this.pokemonStats[1].base_stat+'</li><li>'+this.pokemonStats[2].stat.name+': '+this.pokemonStats[2].base_stat+'</li><li>'+this.pokemonStats[3].stat.name+': '+this.pokemonStats[3].base_stat+'</li><li>'+this.pokemonStats[4].stat.name+': '+this.pokemonStats[4].base_stat+'</li><li>'+this.pokemonStats[5].stat.name+': '+this.pokemonStats[5].base_stat+'</li></ul></div>');
    } else if (this.pokemonAblilites[1]) {
        newCard.append('<div class="myCard"><h1>'+this.pokemonName+'</h1><img src="'+this.pokemonSprites+'" alt="'+this.pokemonName+'"/><h3>Abilities</h3><ul class="myAbilities"><li>'+this.pokemonAblilites[0].ability.name+'</li><li>'+this.pokemonAblilites[1].ability.name+'</li></ul><h3>Stats</h3><ul class="myStats"><li>'+this.pokemonStats[0].stat.name+': '+this.pokemonStats[0].base_stat+'</li><li>'+this.pokemonStats[1].stat.name+': '+this.pokemonStats[1].base_stat+'</li><li>'+this.pokemonStats[2].stat.name+': '+this.pokemonStats[2].base_stat+'</li><li>'+this.pokemonStats[3].stat.name+': '+this.pokemonStats[3].base_stat+'</li><li>'+this.pokemonStats[4].stat.name+': '+this.pokemonStats[4].base_stat+'</li><li>'+this.pokemonStats[5].stat.name+': '+this.pokemonStats[5].base_stat+'</li></ul></div>');
      }else {
        newCard.append('<div class="myCard"><h1>'+this.pokemonName+'</h1><img src="'+this.pokemonSprites+'" alt="'+this.pokemonName+'"/><h3>Abilities</h3><ul class="myAbilities"><li>'+this.pokemonAblilites[0].ability.name+'</li></ul><h3>Stats</h3><ul class="myStats"><li>'+this.pokemonStats[0].stat.name+': '+this.pokemonStats[0].base_stat+'</li><li>'+this.pokemonStats[1].stat.name+': '+this.pokemonStats[1].base_stat+'</li><li>'+this.pokemonStats[2].stat.name+': '+this.pokemonStats[2].base_stat+'</li><li>'+this.pokemonStats[3].stat.name+': '+this.pokemonStats[3].base_stat+'</li><li>'+this.pokemonStats[4].stat.name+': '+this.pokemonStats[4].base_stat+'</li><li>'+this.pokemonStats[5].stat.name+': '+this.pokemonStats[5].base_stat+'</li></ul></div>');
      };
    };


//end MainController
}]);
