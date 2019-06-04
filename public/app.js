const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonId = '';
  this.pokemonName = '';
  this.pokemonResult = '';
  this.selectedOpponentName = '';
  this.selectedOpponentId = '';
  this.pokemonStats = [];
  this.pokemonTypes = [];
  this.pokemonAblilites = [];
  this.myCards = [];
  this.pokemonURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=897";
  this.baseUrl = "https://pokeapi.co/api/v2/pokemon/";
  this.loggedIn = false;
  this.showCreateForm = false;
  this.showLogInForm = false;
  this.showModal = false;
  this.initialNumber = 10;

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
        pokeBalls: 10
      }
    }).then(function(res){
      console.log(res.data);
      controller.username = '';
      controller.password = '';
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
      // console.log(controller.users);
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
      controller.username = '';
      controller.password = '';
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
        controller.checkLogIn();
        console.log(res.data);
    },function(error){
      console.log(error);
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

        for (let i = 0; i < controller.users.length; i++) {
          if(controller.users[i]._id === user._id){
            controller.users[i].pokeBalls = res.data.pokeBalls;
          }
        }
        controller.getCollections();
        controller.checkLogIn();

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

          for (let i = 0; i < controller.users.length; i++) {
            if(controller.users[i]._id === user._id){
              controller.users[i].pokeBalls = res.data.pokeBalls;
            }
          }
          controller.checkLogIn()
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
  // <<<<<<<<<<<SHOW MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.showModalFunction = () => {
    this.showModal = !this.showModal;
  }
  // ========================================
  // <<<<<<<<<<<CHECK LOGIN FUNCTION>>>>>>>>>
  // ========================================
  this.checkLogIn = () => {
    $http({
      method: 'GET',
      url: '/checkLogIn'
    }).then(function(res){
        if(res.data.currentUser){
          // console.log(res.data.currentUser.pokeBalls);
          for (let i = 0; i < controller.users.length; i++) {
            if (res.data.currentUser._id === controller.users[i]._id) {
              res.data.currentUser.pokeBalls = controller.users[i].pokeBalls;
              // console.log(res.data.currentUser.pokeBalls);
              // console.log(controller.users[i].pokeBalls);
            }
          }
          // console.log(controller.users);
          controller.loggedInUser = res.data.currentUser;
          controller.comparePokemon()

        }else{
          controller.loggedInUser = '';
        }
    }, function(error){
      console.log(error);
    });
  };

  // ========================================
  // <<<<<<CATCH POKEMON FUNCTION>>>>>>>>>
  // ========================================
  this.catchPokemon = () => {
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
      controller.pokemonId = res.data._id;
      let statVariable = 0;
      for(let i = 0; i < res.data.stats.length; i++){
        statVariable+=res.data.stats[i].base_stat
      };
      let lowPercent = .15;
      let mediumPercent = .30;
      let highPercent = .45;
      let randomMath = parseFloat(Math.random()*1).toFixed(2);

      if(statVariable < 350){

        if( randomMath < highPercent){
          if(controller.loggedInUser.pokeBalls > 0){
            controller.spendPokeballs(controller.loggedInUser);
            controller.checkLogIn();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.checkLogIn()
          controller.showModalFunction();
        };
      } else if (statVariable >= 350 && statVariable < 450){
        if( randomMath < mediumPercent){
          if(controller.loggedInUser.pokeBalls > 0){
            controller.spendPokeballs(controller.loggedInUser);
            controller.getCollections();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.showModalFunction();
        };
      } else if (statVariable >= 450){
        if( randomMath < lowPercent){
          if(controller.loggedInUser.pokeBalls > 0){
            controller.spendPokeballs(controller.loggedInUser);
            controller.getCollections();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.showModalFunction();
        };
      }
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
      // console.log(controller.collections);
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

  // ========================================
  // <<<<<<SELECT OPPONENT FUNCTION>>>>>>>>>
  // ========================================
  this.selectOpponent = ($event) => {
    console.log($event.target.innerHTML);
    controller.selectedOpponentName = $event.target.innerHTML;
    console.log(controller.selectedOpponentName);
    for (let h = 0; h < controller.users.length; h++) {
      if (controller.users[h].username === controller.selectedOpponentName) {
        controller.selectedOpponentId = controller.users[h]._id
        console.log(controller.selectedOpponentId);
        controller.comparePokemon();
      }
    }
  }
  // ========================================
  // <<<<<<COMPARE POKEMON FUNCTION>>>>>>>>>
  // ========================================
  this.comparePokemon = () => {
    console.log(controller.loggedInUser);
    console.log(controller.users);
    console.log(controller.collections);

    for (let i = 0; i < controller.collections.length; i++) {
      if (controller.collections[i].ownerId === controller.loggedInUser._id) {
        console.log(controller.collections[i].name);
      }
      if (controller.collections[i].ownerId === controller.selectedOpponentId){
        console.log('opponent: ' + controller.collections[i].name);
      }
    }

  }
  // let myInt = setInterval(function(){
  //   for(let i = 0; i < controller.users.length; i++){
  //     controller.recoverPokeballs(controller.users[i]);
  //   }
  // }, 10000);
  this.getPokemon();
  this.getCollections();
  this.logOut();
  this.checkLogIn();
  this.getUsers();


//end MainController
}]);
