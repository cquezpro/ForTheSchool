angular.module('starter.services', [])

.factory('Register', function($rootScope, $http, $location, API_URL, $ionicLoading) {
    
    var RegisterFactory = {};
    
    var _doBasicRegister = function() {
        var name = $('#RegisterNameField').val();
        var email = $('#RegisterEmailField').val();
        var password = $('#RegisterPasswordField').val();
        if(name != '') {
            var firstname = name.substr(0,name.indexOf(' '));
            var lastname = name.substr(name.indexOf(' ')+1);
        } else {
            var firstname = '';
            var lastname = '';
        }
        var url = API_URL+'/api/newuser?token=12345&email='+email+'&password='+password+'&firstname='+firstname+'&lastname='+lastname;
        
        return $http.get(url).then(function(data) {
            return data.data;
        }); 
    }
    
    var _onSuccess = function() {
        localStorage.setItem('login_password', $('#RegisterPasswordField').val());
        localStorage.setItem('login_email', $('#RegisterEmailField').val());
        $location.path('/newuser1');
    }
    
    RegisterFactory.doBasicRegister = _doBasicRegister;
    RegisterFactory.onSuccess = _onSuccess;
    return RegisterFactory;
})

.factory('Login', function($rootScope, $http, $location, API_URL, FB_ID, $cordovaFacebook, $ionicLoading) {
    
    var LoginFactory = {};
    
    var _doBasicLogin = function(email, password) {
        var url = API_URL+'/api/loginuser?token=12345&email='+email+'&password='+password;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _facebookLogin = function(fbid, token) {
        var url = API_URL+'/api/facebookuser?token=12345'+
            '&fbid='+fbid+
            '&accessToken='+token;
        $http.get(url).then(function(data) {
            $rootScope.userObject = data.data;
            localStorage.setItem('login_facebook_id', $rootScope.userObject.fb_user_id);
            localStorage.setItem('login_facebook_token', token);

            var launched = localStorage.getItem('launched');
            if(launched) {
                if($rootScope.userObject.group_id !== false) {
                    $location.path('/menu/tabs/topstores');
                } else {
                    $location.path('/schoolsearch/main');
                }
            } else {
                localStorage.setItem('launched',1);
                $location.path('/newuser1');
            }
        });
    }
    
    var _facebook = function() {
        $cordovaFacebook.login(["public_profile", "email", "user_friends"])
            .then(function(success) {
                var fbid = success.authResponse.userID;
                var token = success.authResponse.accessToken;
                _facebookLogin(fbid, token);
            }, function (error) {
                console.log(error)
        });
    }

    var _onSuccess = function() {
        localStorage.setItem('login_email', $('#LoginEmailField').val());
        localStorage.setItem('login_password', $('#LoginPasswordField').val());
        
        var launched = localStorage.getItem('launched');
        if(launched) {
            if($rootScope.userObject.group_id !== false) {
                $location.path('/menu/tabs/topstores');
            } else {
                $location.path('/schoolsearch/main');
            }
        } else {
            localStorage.setItem('launched',1);
            $location.path('/newuser1');
        }
    }
    
    var _logout = function() {
        localStorage.setItem('login_password','');
        localStorage.setItem('login_email','');
        localStorage.setItem('login_facebook_id','');
        localStorage.setItem('login_facebook_token','');
        $rootScope.userObject = [];
        $location.path('/home');
        $('#logo').delay(1000).fadeOut(400);
        $('#primary').delay(1000).fadeIn(400);
    }
    
    LoginFactory.doBasicLogin = _doBasicLogin;
    LoginFactory.facebook = _facebook;
    LoginFactory.facebookLogin = _facebookLogin;
    LoginFactory.onSuccess = _onSuccess;
    LoginFactory.logout = _logout;
    return LoginFactory;
})

.factory('User', function($rootScope, $http, $location, API_URL, $ionicLoading) {
    
    var UserFactory = {};
    
    var _update = function(user) {
        var url = API_URL+'/api/updateuser?token=12345'+
            '&user_id='+$rootScope.userObject.id+
            '&app_key='+$rootScope.userObject.app_key+
            '&firstname='+user.firstname+
            '&lastname='+user.lastname+
            '&email='+user.email+
            '&address1='+user.address1+
            '&address2='+user.address2+
            '&city='+user.city+
            '&state='+user.state+
            '&zip='+user.zip;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _favorites = function() {
        var url = API_URL+'/api/getfavorites?token=12345'+
            '&user_id='+$rootScope.userObject.id+
            '&key='+$rootScope.userObject.app_key;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _addFavorite = function(store_id) {
        var url = API_URL+'/api/addfavorite?token=12345'+
            '&store_id='+store_id+
            '&user_id='+$rootScope.userObject.id+
            '&key='+$rootScope.userObject.app_key;
        console.log(url)
        $http.get(url).then(function(data) {
            console.log(data)
            console.log($rootScope.userObject.favorite_ids)
            $rootScope.userObject.favorite_ids.push(parseInt(store_id));
            console.log($rootScope.userObject.favorite_ids)
        });
    }
    
    var _removeFavorite = function(store_id) {
        var url = API_URL+'/api/deletefavorite?token=12345'+
            '&store_id='+store_id+
            '&user_id='+$rootScope.userObject.id+
            '&key='+$rootScope.userObject.app_key;
        console.log(url)
        $http.get(url).then(function(data) {
            console.log(data)
            console.log($rootScope.userObject.favorite_ids)
           $rootScope.userObject.favorite_ids.splice($rootScope.userObject.favorite_ids.indexOf(parseInt(store_id)),1);
            console.log($rootScope.userObject.favorite_ids)
        });
    }

    var _earnings = function() {
        var url = API_URL+'/api/userearnings?token=12345'+
            '&user_id='+$rootScope.userObject.id+
            '&app_key='+$rootScope.userObject.app_key;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _getAttribution = function() {
        var url = API_URL+'/api/getattribution?token=12345'+
            '&user_id='+$rootScope.userObject.id+
            '&app_key='+$rootScope.userObject.app_key;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _setAttribution = function(group_percent) {
        var url = API_URL+'/api/setattribution?token=12345'+
            '&user_id='+$rootScope.userObject.id+
            '&app_key='+$rootScope.userObject.app_key+
            '&group_percent='+group_percent;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    UserFactory.update = _update;
    UserFactory.favorites = _favorites;
    UserFactory.addFavorite = _addFavorite;
    UserFactory.removeFavorite = _removeFavorite;
    UserFactory.earnings = _earnings;
    UserFactory.getAttribution = _getAttribution;
    UserFactory.setAttribution = _setAttribution;
    return UserFactory;
})

.factory('Stores', function($rootScope, $http, $location, $ionicModal, API_URL, $ionicLoading) {
    
    var StoresFactory = {};
    
    var _topStores = function() {
        var url = API_URL+'/api/stores?token=12345';
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _search = function(q) {
        var url = API_URL+'/api/stores?token=12345&search='+q;
        return $http.get(url).then(function(data) {
            return data.data;
        }); 
    }
    
    var _searchOffers = function(q) {
        var url = API_URL+'/api/offers?token=12345&keywords='+q;
        return $http.get(url).then(function(data) {
            return data.data;
        }); 
    }
    
    var _load = function(store) {
        $rootScope.currentStore = store;

        $ionicModal.fromTemplateUrl('./templates/activatemodal.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $rootScope.activateModal = modal;
            $rootScope.activateModal.show();

            opts = {};
           // opts.height = 900;
            opts.top = 200;
            opts.bottom = 200;                            
            //opts.width = '100%';//$('body').width();
            opts.src = store.link+'&appuid='+$rootScope.userObject.id+'&appskip=1';
            //opts.scalesPageToFit = true;
            
            wizViewManager.create('webView', opts, function() {
               // alert($("#screen header").height());
                //alert($("#screen #store").height());
                wizViewManager.setLayout('webView', opts, function() {
                    wizViewManager.load('webView', opts.src, function() {
                        
                        var url = API_URL+'/api/offers?token=12345&s='+store.store_id;
                        $http.get(url).then(function(data) {
                            $rootScope.currentDeals = data.data;
                            wizViewManager.show('webView');
                            $rootScope.activateModal.hide();
                            $location.path('/webview');
                        }); 
                        
                    });
                });
            });
        });
    }
    
    var _loadDeal = function(link) {
        var url = link+'&appuid='+$rootScope.userObject.id+'&appskip=1';
        wizViewManager.load('webView', url, function() {
            wizViewManager.show('webView',{});
            $("article#screen").animate({'marginRight' : "0px", 'marginLeft' : "0%"},"fast");
            $("article#menu-right").animate({'marginLeft' : "200%"},"fast");
        });
    }
    
    var _loadDealFromSearch = function(offer) {
        $rootScope.currentDeal = offer;

        $ionicModal.fromTemplateUrl('./templates/activateoffermodal.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $rootScope.activateModal = modal;
            $rootScope.activateModal.show();

            opts = {};
            opts.height = 300;
            opts.top = 50;
            opts.bottom = 150;  
            opts.width = '100%';//$('body').width();
            opts.src = offer.link+'&appuid='+$rootScope.userObject.id+'&appskip=1';
            //opts.scalesPageToFit = true;
            
            wizViewManager.create('webView', opts, function() {
                wizViewManager.load('webView', opts.src, function() {
                    
                    var url = API_URL+'/api/offers?token=12345&s='+offer.store_id;
                    $http.get(url).then(function(data) {
                        $rootScope.currentDeals = data.data;
                        wizViewManager.show('webView');
                        $rootScope.activateModal.hide();
                        $location.path('/webview');
                    }); 
                    
                });
            });
        });
    }
    
    StoresFactory.topStores = _topStores;
    StoresFactory.search = _search;
    StoresFactory.searchOffers = _searchOffers;
    StoresFactory.load = _load;
    StoresFactory.loadDeal = _loadDeal;
    StoresFactory.loadDealFromSearch = _loadDealFromSearch;
    return StoresFactory;
})

.factory('Schools', function($rootScope, $http, $location, $ionicPopup, API_URL, $ionicLoading) {
    
    var SchoolsFactory = {};
    
    var _searchByZip = function(zip) {
        var url = API_URL+'/api/getgroupsbyzip?token=12345&zip='+zip;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _searchByGeo = function(lat, lon) {
        var url = API_URL+'/api/getgroupsbygeo?token=12345&lat='+lat+'&lon='+lon;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    var _support = function(id, name) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Support Group',
            template: 'Are you sure you want to support '+name+'?' 
        });
        confirmPopup.then(function(res) {
            if(res) {
                var url = API_URL+'/api/supportgroup?token=12345'+
                    '&email='+$rootScope.userObject.email+
                    '&key='+$rootScope.userObject.app_key+
                    '&group_id='+id;
                $http.get(url).then(function(data) {
                    $rootScope.userObject.group_id = id;
                    $rootScope.userObject.group_name = name;
                    $location.path('/menu/tabs/topstores');
                    
                    var firstschool = localStorage.getItem('firstschool');
                    if(firstschool) {
                        $location.path('/menu/tabs/topstores');
                    } else {
                        localStorage.setItem('firstschool',1);
                        $location.path('/cashback');
                    }
                });
            }
        });
    }
    
    var _add = function(school) {
        var url = API_URL+'/api/newgroup?token=12345'+
            '&email='+$rootScope.userObject.email+
            '&key='+$rootScope.userObject.app_key+
            '&main_city='+school.city+
            '&main_state='+school.state+
            '&main_postal='+school.zip+
            '&name='+school.name;
        return $http.get(url).then(function(data) {
            return data.data;
        });
    }
    
    SchoolsFactory.searchByZip = _searchByZip;
    SchoolsFactory.searchByGeo = _searchByGeo;
    SchoolsFactory.support = _support;
    SchoolsFactory.add = _add;
    return SchoolsFactory;
})

.factory('States', function() {

  var states = {
            'AL': 'ALABAMA',
            'AK': 'ALASKA',
            'AZ': 'ARIZONA',
            'AR': 'ARKANSAS',
            'CA': 'CALIFORNIA',
            'CO': 'COLORADO',
            'CT': 'CONNECTICUT',
            'DE': 'DELAWARE',
            'DC': 'DISTRICT OF COLUMBIA',
            'FL': 'FLORIDA',
            'GA': 'GEORGIA',
            'HI': 'HAWAII',
            'ID': 'IDAHO',
            'IL': 'ILLINOIS',
            'IN': 'INDIANA',
            'IA': 'IOWA',
            'KS': 'KANSAS',
            'KY': 'KENTUCKY',
            'LA': 'LOUISIANA',
            'ME': 'MAINE',
            'MD': 'MARYLAND',
            'MA': 'MASSACHUSETTS',
            'MI': 'MICHIGAN',
            'MN': 'MINNESOTA',
            'MS': 'MISSISSIPPI',
            'MO': 'MISSOURI',
            'MT': 'MONTANA',
            'NE': 'NEBRASKA',
            'NV': 'NEVADA',
            'NH': 'NEW HAMPSHIRE',
            'NJ': 'NEW JERSEY',
            'NM': 'NEW MEXICO',
            'NY': 'NEW YORK',
            'NC': 'NORTH CAROLINA',
            'ND': 'NORTH DAKOTA',
            'OH': 'OHIO',
            'OK': 'OKLAHOMA',
            'OR': 'OREGON',
            'PA': 'PENNSYLVANIA',
            'RI': 'RHODE ISLAND',
            'SC': 'SOUTH CAROLINA',
            'SD': 'SOUTH DAKOTA',
            'TN': 'TENNESSEE',
            'TX': 'TEXAS',
            'UT': 'UTAH',
            'VT': 'VERMONT',
            'VA': 'VIRGINIA',
            'WA': 'WASHINGTON',
            'WV': 'WEST VIRGINIA',
            'WI': 'WISCONSIN',
            'WY': 'WYOMING'
        };

  return {
    all: function() {
      return states;
    }
  }
});
