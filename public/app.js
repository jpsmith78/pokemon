const app = angular.module('MyApp', []);



app.controller('MainController', ['$http', function($http){
  const controller = this;

  this.pokemonList = [];
  this.pokemonSprites = '';
  this.pokemonId = '';
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
  this.showCatchModal = false;
  this.showFailModal = false;
  this.loginFailModal = false;
  this.showWinModal = false;
  this.showLoseModal = false;
  this.initialNumber = 10;

  this.selectedOpponentName = '';
  this.selectedOpponentId = '';
  this.userPokemon = '';
  this.enemyPokemon = '';

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
        pokeBalls: 10,
        userWins: 0,
        userLosses: 0
      }
    }).then(function(res){
      console.log(res.data);
      controller.username = '';
      controller.password = '';
      controller.showCreateForm = false;
      controller.getUsers();
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
      controller.username = '';
      controller.password = '';
      controller.checkLogIn();
      controller.getCollections();
      console.log(res.data);
    },function(error){
      console.log(error);
      controller.loginFailModalFunction();
      controller.username = '';
      controller.password = '';
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
        controller.getCollections();
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
  // <<<<<<<INCREMENT WINS FUNCTION>>>>>>>>>
  // ========================================
  this.incrementWins = (user) => {
    $http({
      method: 'PUT',
      url: '/users/'+user._id,
      data: {
        userWins: user.userWins
      }
    }).then(function(res){
      user.userWins++;
      res.data.userWins++;

      for (let i = 0; i < controller.users.length; i++) {
        if(controller.users[i]._id === user._id){
          controller.users[i].userWins = res.data.userWins;
        }
      }
      controller.getCollections();
      controller.checkLogIn();
    })
  }


  // ========================================
  // <<<<<<<INCREMENT LOSSES FUNCTION>>>>>>>>>
  // ========================================
  this.incrementLosses = (user) => {
    $http({
      method: 'PUT',
      url: '/users/'+user._id,
      data: {
        userLosses: user.userLosses
      }
    }).then(function(res){
      user.userLosses++;
      res.data.userLosses++;

      for (let i = 0; i < controller.users.length; i++) {
        if(controller.users[i]._id === user._id){
          controller.users[i].userLosses = res.data.userLosses;
        }
      }
      controller.getCollections();
      controller.checkLogIn();
    })
  }

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
  // <<<<<<<<<<<SHOW FAIL MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.showFailModalFunction = () => {
    this.showFailModal = !this.showFailModal;
  };

  // ========================================
  // <<<<<<<<<<<SHOW CATCH MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.showCatchModalFunction = () => {
    this.showCatchModal = !this.showCatchModal;
  };

  // ========================================
  // <<<<<<<<<<<SHOW WIN MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.showWinModalFunction = () => {
    this.showWinModal = !this.showWinModal;
  };

  // ========================================
  // <<<<<<<<<<<SHOW LOSE MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.showLoseModalFunction = () => {
    this.showLoseModal = !this.showLoseModal;
  };

  // ========================================
  // <<<<<<<<<<<SHOW LOSE MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.fullPokeballsModalFunction = () => {
    this.fullPokeballsModal = !this.fullPokeballsModal;
  };

  // ========================================
  // <<<<<<<<<<<SHOW LOSE MODAL FUNCTION>>>>>>>>>
  // ========================================
  this.emptyPokeballsModalFunction = () => {
    this.emptyPokeballsModal = !this.emptyPokeballsModal;
  };
  // ========================================
  // <<<<<<<<<<<SHOW LOGIN FAIL FUNCTION>>>>>>>>>
  // ========================================
  this.loginFailModalFunction = () => {
    this.loginFailModal = !this.loginFailModal;
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
          for (let i = 0; i < controller.users.length; i++) {
            if (res.data.currentUser._id === controller.users[i]._id) {
              res.data.currentUser.pokeBalls = controller.users[i].pokeBalls;
              res.data.currentUser.userWins = controller.users[i].userWins;
              res.data.currentUser.userLosses = controller.users[i].userLosses;
            }
          }
          controller.loggedInUser = res.data.currentUser;
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
            controller.getCollections();
            controller.checkLogIn();
            controller.showCatchModalFunction();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.checkLogIn()
          controller.showFailModalFunction();
        };
      } else if (statVariable >= 350 && statVariable < 450){
        if( randomMath < mediumPercent){
          if(controller.loggedInUser.pokeBalls > 0){
            controller.spendPokeballs(controller.loggedInUser);
            controller.getCollections();
            controller.checkLogIn();
            controller.showCatchModalFunction();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.checkLogIn()
          controller.showFailModalFunction();
        };
      } else if (statVariable >= 450){
        if( randomMath < lowPercent){
          if(controller.loggedInUser.pokeBalls > 0){
            controller.spendPokeballs(controller.loggedInUser);
            controller.getCollections();
            controller.checkLogIn();
            controller.showCatchModalFunction();
          };
        }else {
          controller.deleteCollection(res.data);
          controller.spendPokeballs(controller.loggedInUser);
          controller.checkLogIn()
          controller.showFailModalFunction();
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
    if(controller.loggedInUser && controller.loggedInUser.pokeBalls > 0 && controller.loggedInUser.pokeBalls < 10){
      controller.selectedOpponentName = $event.target.innerHTML;
      for (let h = 0; h < controller.users.length; h++) {
        if (controller.users[h].username === controller.selectedOpponentName) {
          controller.selectedOpponentId = controller.users[h]._id
          controller.comparePokemon();
        }
      }
    } else if (controller.loggedInUser && controller.loggedInUser.pokeBalls >= 10){
      controller.fullPokeballsModalFunction();
    } else if (controller.loggedInUser && controller.loggedInUser.pokeBalls <= 0){
      controller.emptyPokeballsModalFunction();
    }
  }
  // ========================================
  // <<<<<<COMPARE POKEMON FUNCTION>>>>>>>>>
  // ========================================
  this.comparePokemon = () => {

    let ownerPokemon = [];
    let opponentPokemon = [];
      for (let i = 0; i < controller.collections.length; i++) {
        if (controller.collections[i].ownerId === controller.loggedInUser._id) {
          ownerPokemon.push(controller.collections[i]);
        }

        if (controller.collections[i].ownerId === controller.selectedOpponentId){
          opponentPokemon.push(controller.collections[i]);
        }
      }
      let ownerRandomizer = Math.floor(Math.random() * ownerPokemon.length);
      let opponentRandomizer = Math.floor(Math.random() * opponentPokemon.length);
      let recoverRandomizer = Math.floor(Math.random() * 3);

      controller.userPokemon = ownerPokemon[ownerRandomizer];
      controller.enemyPokemon = opponentPokemon[opponentRandomizer];

      if(controller.userPokemon.stats[4].base_stat > controller.enemyPokemon.stats[3].base_stat){
        controller.showWinModalFunction();
        controller.incrementWins(controller.loggedInUser);
        controller.recoverPokeballs(controller.loggedInUser);

      }else{
        controller.showLoseModalFunction();
        controller.incrementLosses(controller.loggedInUser);
        controller.spendPokeballs(controller.loggedInUser);

      }
  }

  let myInt = setInterval(function(){
    for(let i = 0; i < controller.users.length; i++){
      controller.recoverPokeballs(controller.users[i]);
    }
  }, 120000);



  this.logOut();
  this.getUsers();
  this.getPokemon();
  this.getCollections();
  this.checkLogIn();



//end MainController
}]);
