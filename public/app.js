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
        controller.loggedInUser = '';
        controller.getCollections();
        controller.getUsers();
        console.log(res.data);
    });
  };

  // ========================================
  // <<<<<<<SPEND POKEBALL FUNCTION>>>>>>>>>
  // ========================================
  this.spendPokeballs = (user) => {
    $http({
      method: 'PUT',
      url: '/users/'+ user._id,
      data: {
        pokeBalls: user.pokeBalls
      }
    }).then(function(res){
      if(user.pokeBalls > 0){
        user.pokeBalls--;
        res.data.pokeBalls--;
      };
    });
  };

  // ========================================
  // <<<<<<<RECOVER POKEBALL FUNCTION>>>>>>>>>
  // ========================================
  this.recoverPokeballs = (user) => {
    $http({
      method: 'PUT',
      url: '/users/'+ user._id,
      data: {
        pokeBalls: user.pokeBalls
      }
    }).then(function(res){
      if(user.pokeBalls < 10){
            user.pokeBalls++;
            res.data.pokeBalls++;
      };
    });
  };




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
          controller.loggedInUser = res.data.currentUser;
        }else{
          controller.loggedInUser = '';
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
        ownerId: this.loggedInUser._id
      }
    }).then(function(res){
      let statVariable = 0;
      for(let i = 0; i < res.data.stats.length; i++){
        statVariable+=res.data.stats[i].base_stat
      };
      console.log(statVariable);
      console.log(res.data.stats[0].base_stat  );
      if(controller.loggedInUser.pokeBalls > 0){
        controller.spendPokeballs(controller.loggedInUser);
        controller.getCollections();
      };
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

  // let myInt = setInterval(function(){
  //   for(let i = 0; i < controller.users.length; i++){
  //     controller.recoverPokeballs(controller.users[i]);
  //   }
  // }, 10000);
  this.checkLogIn();
  this.getUsers();
  this.getPokemon();
  this.getCollections();
  this.logOut();

//end MainController
}]);
