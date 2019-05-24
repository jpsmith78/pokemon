const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonName = '';
  this.pokemonResult = '';
  this.pokemonStats = [];
  this.pokemonTypes = [];
  this.pokemonAblilites = [];
  this.myCards = [];
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=897";
  this.baseUrl = "https://pokeapi.co/api/v2/pokemon/";
  this.loggedIn = false;
  this.showCreateForm = false;
  this.showLogInForm = false;
  this.initialNumber = 10;
  this.currentNumber = this.initialNumber;

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
        controller.pokemonTypes = [];
        for (let h = 0; h < response.data.types.length; h++) {
          controller.pokemonTypes.push(response.data.types[h])
        };
        controller.pokemonAblilites = [];
        for (let i = 0; i < response.data.abilities.length; i++) {
          controller.pokemonAblilites.push(response.data.abilities[i]);
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
  // <<<<<<<<<<<CREATE USER FUNCTION>>>>>>>>>
  // ========================================
  this.createUser = () => {
    $http({
      method: 'POST',
      url: '/users',
      data:{
        username: this.username,
        password: this.password,
        pokeBalls: this.initialNumber
      }
    }).then(function(res){
      console.log(res.data);
      controller.showCreateForm = false;
    },function(error){
      console.log(error);
    });
  };


  // ========================================
  // <<<<<<GET USERS FUNCTION>>>>>>>>>
  // ========================================
  this.getUsers = () => {
    $http({
      method: 'GET',
      url: '/users'
    }).then(function(res){
      controller.users = res.data;
      console.log(controller.users);
    },function(error){
      console.log(error);
    })
  }

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
      console.log(res.data);
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
      console.log(res.data);
    });
  };

  // ========================================
  // <<<<<<<SPEND POKEBALL FUNCTION>>>>>>>>>
  // ========================================
  this.spendPokeballs = (user) => {
    $http({
      method: 'PUT',
      url: '/users/'+ user,
      data: {
        pokeBalls: controller.currentNumber - 1
      }
    }).then(function(res){
      console.log(res.data.pokeBalls);
    })
  }

  // ========================================
  // <<<<<<<SHOW CREATE USER FUNCTION>>>>>>>>>
  // ========================================
  this.showCreateUsersForm = () => {
    this.showCreateForm = !this.showCreateForm;
  };

  // ========================================
  // <<<<<<<<<<<SHOW LOG IN FUNCTION>>>>>>>>>
  // ========================================
  this.showLogInUsersForm = () => {
    this.showLogInForm = !this.showLogInForm;
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
          controller.loggedInPokeBalls = res.data.currentUser.pokeBalls;
        }else{
          controller.loggedInUserName = '';
          controller.loggedInUserId = '';
          controller.loggedInPokeBalls = '';
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
        types: this.pokemonTypes,
        abilities: this.pokemonAblilites,
        stats: this.pokemonStats,
        ownerId: this.loggedInUserId
      }
    }).then(function(res){
      controller.getCollections();
    },function(error){
      console.log(error);
    });
  };

  // ========================================
  // <<<<<<GET COLLECTION FUNCTION>>>>>>>>>
  // ========================================

  this.getCollections = () => {
    $http({
      method: 'GET',
      url: '/collections'
    }).then(function(res){
      controller.collections = res.data;
      console.log(controller.collections);
    },function(error){
      console.log(error);
    });
  };


  // ========================================
  // <<<<<<DELETE COLLECTION FUNCTION>>>>>>>>>
  // ========================================

  this.deleteCollection = (pokemon) => {
    $http({
      method: 'DELETE',
      url: '/collections/'+ pokemon._id
    }).then(function(res){
      controller.getCollections();
    },function(error){
      console.log(error);
    });
  };

  this.getUsers();
  this.getPokemon();
  this.getCollections();
  this.checkLogIn();

//end MainController
}]);
