angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'ngCordova'])

.constant('API_URL','http://www.fortheschools.com')
.constant('STORAGE_URL', 'http://d2umvgb8hls1bt.cloudfront.net/uploads/stores/')
.constant('CLOUDFRONT_URL', 'http://dxw3joesmwyqi.cloudfront.net')
.constant('FB_ID', 395843057092465)
.constant('$ionicLoadingConfig', {template: 'Loading...'})

.run(function($ionicPlatform, $rootScope) { 
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    TestFairy.begin("16759db88316268a7ecf23caffb2c0a8696d0563");
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider

  .state('home', {
    url: "/home",
    abstract: false,
    templateUrl: "templates/home.html",
    controller: 'HomeCtrl'
  })

  .state('login', {
    url: "/login",
    abstract: false,
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })
  
  .state('signup', {
    url: "/signup",
    abstract: false,
    templateUrl: "templates/signup.html",
    controller: 'SignupCtrl'
  })
  
  .state('terms', {
    url: "/terms",
    abstract: false,
    templateUrl: "templates/terms.html",
    controller: 'TermsCtrl'
  })
  
  .state('privacy', {
    url: "/privacy",
    abstract: false,
    templateUrl: "templates/privacy.html",
    controller: 'PrivacyCtrl'
  })
  
  .state('webview', {
    url: "/webview",
    abstract: false,
    templateUrl: "templates/webview.html",
    controller: 'WebViewCtrl'
  })
  
  .state('cashback', {
      url: "/cashback",
      abstract: false,
      templateUrl: "templates/cashback.html",
      controller: 'CashbackCtrl'
  })
  
  .state('newuser1', {
      url: "/newuser1",
      abstract: false,
      templateUrl: "templates/newuser1.html",
      controller: 'newUserCtrl1'
  })
  
  .state('newuser2', {
      url: "/newuser2",
      abstract: false,
      templateUrl: "templates/newuser2.html",
      controller: 'newUserCtrl2'
  })
  
  .state('newuser3', {
      url: "/newuser3",
      abstract: false,
      templateUrl: "templates/newuser3.html",
      controller: 'newUserCtrl3'
  })
  
  .state('schoolsearch', {
    url: "/schoolsearch",
    abstract: true,
    templateUrl: "templates/schoolsearch.html",
  })
  .state('schoolsearch.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "templates/schoolsmain.html",
        controller: 'SchoolsCtrl'
      }
    }
  })
  .state('schoolsearch.geo', {
    url: "/main/geo",
    views: {
      'menuContent': {
        templateUrl: "templates/schoolsgeo.html",
        controller: 'SchoolsGeoCtrl'
      }
    }
  })
  .state('schoolsearch.zip', {
    url: "/main/zip",
    views: {
      'menuContent': {
        templateUrl: "templates/schoolszip.html",
        controller: 'SchoolsZipCtrl'
      }
    }
  })
  .state('schoolsearch.add', {
    url: "/main/add",
    views: {
      'menuContent': {
        templateUrl: "templates/schoolsadd.html",
        controller: 'SchoolsAddCtrl'
      }
    }
  })


  .state('menu', {
    url: "/menu",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
  })
  .state('menu.tabs', {
    url: "/tabs",
    abstract: true,
    views: {
      'menuContent' :{
        templateUrl: "templates/tabs.html"
      }
    }
  })
  .state('menu.tabs.favorites', {
    url: "/favorites",
    views: {
      'favorites-tab': {
        templateUrl: "templates/favorites.html",
        controller: 'FavoritesCtrl'
      }
    }
  })
  .state('menu.tabs.topstores', {
    url: "/topstores",
    views: {
      'topstores-tab': {
        templateUrl: "templates/topstores.html",
        controller: 'TopStoresCtrl'
      }
    }
  })
  .state('menu.tabs.share', {
    url: "/share",
    views: {
      'share-tab': {
        templateUrl: "templates/share.html",
        controller: 'ShareCtrl'
      }
    }
  })
  .state('menu.tabs.search', {
    url: "/search",
    views: {
      'search-tab': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })
  .state('menu.tabs.earnings', {
    url: "/earnings",
    views: {
      'earnings-tab': {
        templateUrl: "templates/earnings.html",
        controller: 'EarningsCtrl'
      }
    }
  })
  .state('menu.tabs.update', {
    url: "/update",
    views: {
      'update-tab': {
        templateUrl: "templates/update.html",
        controller: 'UpdateCtrl'
      }
    }
  })
  .state('menu.tabs.faqs', {
    url: "/faqs",
    views: {
      'faqs-tab': {
        templateUrl: "templates/faqs.html",
        controller: 'FaqsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/home');

});
