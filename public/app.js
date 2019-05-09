const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){
  const controller = this;

  this.appName = "Pokemon Fighting Game!";
  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonName = '';
  this.pokemonResult = '';
  this.pokemonStats = [];
  this.pokemonAblilites = [];
  this.myCards = [];
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=964";
  this.baseUrl = "https://pokeapi.co/api/v2/pokemon/";

  this.loggedIn = false;


  // ========================================
  // <<<<<<<<SHOW SELECTED POKEMON INFO>>>>>>
  // ========================================

  this.findPokemon = ()=>{
    $http({
      method: 'GET',
      url: this.baseUrl + this.pokemonResult
    }).then(response => {
      console.log(response.data);
        controller.pokemonSprites = response.data.sprites.front_default;
        controller.pokemonName = response.data.name
        controller.pokemonAblilites = [];
        for (var i = 0; i < response.data.abilities.length; i++) {
          this.pokemonAblilites.push(response.data.abilities[i]);
        };
        controller.pokemonStats = [];
        for (let j = 0; j < response.data.stats.length; j++){
          controller.pokemonStats.push(response.data.stats[j]);
        };


    }, error => {
      console.log(error);
    })
  }

  // ========================================
  // <<<<<<<<<<PRINT POKEMON LIST>>>>>>>>
  // ========================================

  this.getPokemon = () => {
    $http({
      method: 'GET',
      url: this.pokemonURL
    }).then(response =>{
        console.log(response.data);
        for (let i = 0; i < response.data.results.length; i++) {
          controller.pokemonList.push(response.data.results[i].name);
        }
    }, error => {
      console.log(error);
    })
  };

  // ========================================
  // <<<<<<<<<<MOVE NAME TO INPUT FIELD>>>>>>
  // ========================================

  this.moveNameToInputField = ($event) => {
    controller.pokemonResult = $event.target.innerHTML
  };

  // ========================================
  // <<<<<<<<<<BUY POKEMON FUNCTION>>>>>>>>>
  // ========================================

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

    // ========================================
    // <<<<<<<<<<<CREATE USER FUNCTION>>>>>>>>>
    // ========================================
    this.createUser = () => {
      $http({
        method: 'POST',
        url: '/users',
        data:{
          username: this.username,
          password: this.password
        }
      }).then(function(res){
        console.log(res);
      },function(error){
        console.log(error);
      });
    };

    // ========================================
    // <<<<<<<<<<<USER LOGIN FUNCTION>>>>>>>>>
    // ========================================
    this.logIn = () => {
      $http({
        method: 'POST',
        url: '/sessions',
        data:{
          username: this.username,
          password: this.password
        }
      }).then(function(res){
        controller.loggedIn = true;
        controller.checkLogIn();
        console.log(controller.loggedIn);
        console.log(controller.username);
      },function(error){
        console.log(error);
      });
    };

    // ========================================
    // <<<<<<<<<<<USER LOG OUT FUNCTION>>>>>>>>>
    // ========================================

    this.logOut = () => {
      $http({
        method: 'DELETE',
        url: '/sessions'
      }).then(function(res){
        controller.loggedIn = false;
        controller.checkLogIn;
        controller.loggedInUserName = '';
        controller.loggedInUserId = '';
        console.log(controller.loggedIn);
        console.log(controller.loggedInUserName);
      });
    };

    // ========================================
    // <<<<<<<<<<<CHECK LOGIN FUNCTION>>>>>>>>>
    // ========================================
    this.checkLogIn = () => {
      $http({
        method: 'GET',
        url: '/checkLogIn'
      }).then(function(res){
          if(res.data.currentUser){
            controller.loggedInUserName = res.data.currentUser.username;
            controller.loggedInUserId = res.data.currentUser._id;
            console.log(controller.loggedInUserId);
          }else{
            controller.loggedInUserName = '';
            controller.loggedInUserId = '';
          }
      }, function(error){
        console.log(error);
      });
    };

    // ========================================
    // <<<<<<CREATE COLLECTION FUNCTION>>>>>>>>>
    // ========================================
    this.createCollection = () => {
      $http({
        method: 'POST',
        url: '/collections',
        data: {
          name: this.pokemonName,
          image: this.pokemonSprites,
          abilities: this.pokemonAblilites,
          stats: this.pokemonStats,
          ownerId: this.loggedInUserId
        }
      }).then(function(res){
        console.log(res.data);
      })
    }

    this.checkLogIn();

//end MainController
}]);
