angular.module('starter.controllers', [])

.controller('HomeCtrl', function($rootScope, $scope, Login, $ionicLoading) {
    var email = localStorage.getItem('login_email');
    var password = localStorage.getItem('login_password');
    var fbid = localStorage.getItem('login_facebook_id');
    var fbtoken = localStorage.getItem('login_facebook_token');

    //testing purposes
    //var email = 'dev@cofundraising.com';
    //var password = 'b0ggle278';

    if((fbid != null) && (fbtoken != null) && (fbid != '') && (fbtoken != '')) {
        Login.facebookLogin(fbid, fbtoken);
    } else if((email != null) && (password != null) && (email != '') && (password != '')) {
        Login.doBasicLogin(email, password).then(function (data) {
            $scope.result = data;
        });
        $scope.$watch('result', function (cast) {
            if(angular.isDefined(cast)) {
                if($scope.result.user_id !== 'e1') {
                    $rootScope.userObject = $scope.result.user_data;
                    Login.onSuccess();
                } else {
                    $('#logo').delay(1000).fadeOut(400);
                    $('#primary').delay(1000).fadeIn(400);
                }
            }
        });
    } else {
        $('#logo').delay(1000).fadeOut(400);
        $('#primary').delay(1000).fadeIn(400);
    }
    
    $scope.facebookLogin = function() {
        Login.facebook();
    }
})

.controller('TermsCtrl', function($scope, $http, $sce, API_URL, $ionicLoading) {
    $http.get(API_URL+'/api/terms?token=12345').success(function(data) {
        $scope.terms = $sce.trustAsHtml(data.text);
    });
})

.controller('PrivacyCtrl', function($scope, $http, $sce, API_URL, $ionicLoading) {
    $http.get(API_URL+'/api/privacy?token=12345').success(function(data) {
        $scope.privacy = $sce.trustAsHtml(data.text);
    });
})

.controller('LoginCtrl', function($rootScope, $scope, Login, $ionicLoading) {
    
    //testing purposes
    $scope.user = {email:'betopone1021@gmail.com', password:'dl123456789'};
    
    $scope.failureMsg = '';
    $scope.login = function(user) {
        Login.doBasicLogin(user.email, user.password).then(function (data) {
            $scope.result = data;
        });
        $scope.$watch('result', function (cast) {
            if(angular.isDefined(cast)) {
                if($scope.result.user_id !== 'e1') {
                    $rootScope.userObject = $scope.result.user_data;
                    Login.onSuccess();
                } else {
                    $scope.failureMsg = 'Wrong email or password';
                }
            }
        });
    }
    
    $scope.facebookLogin = function() {
        Login.facebook();
    }
})

.controller('SignupCtrl', function($rootScope, $scope, Register, $ionicLoading) {
    $scope.failureMsg = '';
    $scope.signup = function() {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if($('#RegisterNameField').val() != '' && $('#RegisterEmailField').val() != '' && $('#RegisterPasswordField').val() != '') {
            if(re.test($('#RegisterEmailField').val())) {
                if($('#RegisterPasswordField').val().length > 5) {
                    Register.doBasicRegister().then(function (data) {
                        $scope.result = data; 
                    });
                    $scope.$watch('result', function (cast) {
                        if(angular.isDefined(cast)) {
                            if ($scope.result.user_id == 'e1') {
                                $scope.failureMsg = 'This email is already registred';
                            } else {
                                $rootScope.userObject = $scope.result.user_data;
                                Register.onSuccess();
                            }
                        }
                    });
                } else {
                    $scope.failureMsg = 'Password must be 6 characters'; 
                }
            } else {
                $scope.failureMsg = 'Email is invalid'; 
            }
        } else {
            $scope.failureMsg = 'All fields are required';
        }
    }
})

.controller('newUserCtrl1', function($rootScope, $scope, $location, $ionicLoading, User) {
    // TODO:
})

.controller('newUserCtrl2', function($rootScope, $scope, $location, $ionicLoading, User) {
    // TODO:
})

.controller('newUserCtrl3', function($rootScope, $scope, $location, $ionicLoading, User) {
    // TODO:
})

.controller('CashbackCtrl', function($rootScope, $scope, $location, $ionicLoading, User) {

    User.getAttribution().then(function (data) {
        $scope.result = data;
    });
    $scope.$watch('result', function (cast) {
        if(angular.isDefined(cast)) {
            if($scope.result != 0) {
                $('#slider-2').val($scope.result.uValue);
                $('#sliderValue').text($scope.result.uValue);
                $('#schoolValue').text($scope.result.gValue);
            }
        }
    });
    
    $('#slider-2').change(function() {
        var value = $('#slider-2').val();
        var values = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if((values[i] <= value) || (values[i] >= value)) {
                var newDiff = Math.abs(value - values[i]);
                if(diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        $('#sliderValue').text(nearest);
        $('#schoolValue').text(100-nearest);
    });
    
    $scope.save = function() {
        User.setAttribution($('#schoolValue').text()).then(function (data) {
            $location.path('/menu/tabs/topstores');
        });
    }
    
})

.controller('MenuCtrl', function($rootScope, $scope, $location, Login, $ionicLoading) {
    $scope.user = $rootScope.userObject;
    
    $scope.logout = function() {
        Login.logout();
    }
})

.controller('FavoritesCtrl', function($rootScope, $scope, $ionicSideMenuDelegate, User, Stores, STORAGE_URL, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicLoading.show();
        $ionicSideMenuDelegate.canDragContent(true);
        User.favorites().then(function (data) {
            $scope.result = data;
        });
    });
    
    $scope.showStore = function(store) {
        Stores.load(store);   
    }
    
    $scope.favorites = [];

    $scope.$watch('result', function (cast) {
        if(angular.isDefined(cast)) {
            var f = [];
            for(var i = 0; i < $scope.result.favorites.length; i++) {
                if($scope.result.favorites[i].cashbk_pct) {
                    var discount_print = 'Up to '+$scope.result.favorites[i].cashbk_pct+'% Back';
                    var percent = $scope.result.favorites[i].cashbk_pct+'%';
                    var type = 'Cash Back';
                } else {
                    var discount_print = 'Up to 40% Savings';
                    var percent = '40%';
                    var type = 'Instant Savings';
                }
                f = {
                        store_id: $scope.result.favorites[i].store_id,
                        store_name: $scope.result.favorites[i].store_name,
                        image: STORAGE_URL+$scope.result.favorites[i].image100x39_filename,
                        discount_print: discount_print,
                        percent: percent,
                        type: type,
                        link: $scope.result.favorites[i].app_tracking_url
                    };
                $scope.favorites.push(f);
            }
        }
        $ionicLoading.hide();
    });
})

.controller('TopStoresCtrl', function($rootScope, $scope, $ionicSideMenuDelegate, Stores, STORAGE_URL, $ionicLoading) {
    
    $scope.init = function() {
        $ionicLoading.show();
        Stores.topStores().then(function (data) {
            $scope.result = data;
        });
    }
    $scope.init();
    
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $scope.showStore = function(store) {
        Stores.load(store);   
    }
    
    $scope.topStores = [];
    
    $scope.$watch('result', function (cast) {
        if(angular.isDefined(cast)) {
            var s = [];
            for(var i = 0; i < 20; i++) {
                if($scope.result[i].cashbk_pct) {
                    var discount_print = 'Up to '+$scope.result[i].cashbk_pct+'% Back';
                    var percent = $scope.result[i].cashbk_pct+'%';
                    var type = 'Cash Back';
                } else {
                    var discount_print = 'Up to 40% Savings';
                    var percent = '40%';
                    var type = 'Instant Savings';
                }
                s = {
                        store_id: $scope.result[i].store_id,
                        store_name: $scope.result[i].store_name,
                        image: STORAGE_URL+$scope.result[i].image150x90_filename,
                        discount_print: discount_print,
                        percent: percent,
                        type: type,
                        link: $scope.result[i].app_tracking_url
                    };
                $scope.topStores.push(s);
            }
            $ionicLoading.hide();
        }
    });
})

.controller('ShareCtrl', function($rootScope, $scope, $ionicSideMenuDelegate, Stores, CLOUDFRONT_URL, $cordovaFacebook, $cordovaSocialSharing, $cordovaClipboard, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $scope.reflink = $rootScope.userObject.reflink;
    
    $scope.facebookShare = function() {
        var options = {
            method: "feed",
            picture: CLOUDFRONT_URL + '/img/for-the-schools-shopping-assistant-looking-left.png',
            name:'Earn Cash Back for You and Your School - For the Schools',
            caption: 'www.ForTheSchools.com',
            description: 'Use For the Schools to earn cash back for yourself and your school. Shop and save at over 1,000 stores!',
            link: $rootScope.userObject.reflink
        };
        $cordovaFacebook.showDialog(options)
            .then(function(success) {
                console.log(success)
            }, function (error) {
                console.log(error)
        });
    }
    $scope.twitterShare = function() {
        $cordovaSocialSharing.shareViaTwitter(
                'Use For the Schools to earn cash back for yourself and your school.',
                CLOUDFRONT_URL + '/img/for-the-schools-shopping-assistant-looking-left.png',
                $rootScope.userObject.reflink)
            .then(function(result) {
                console.log(result)
            }, function(err) {
                console.log(err)
        });
    }
    $scope.emailShare = function() {
        $cordovaSocialSharing.shareViaEmail(
                'Use For the Schools to earn cash back for yourself and your school. Shop and save at over 1,000 stores! See more <a href="'+$rootScope.userObject.reflink+'">here</a>.', 
                'Earn Cash Back for You and Your School - For the Schools', 
                null, null, null)
            .then(function(result) {
                console.log(result)
            }, function(err) {
                console.log(err)
        });
    }
    $scope.copy = function() {
        $cordovaClipboard.copy($rootScope.userObject.reflink)
            .then(function () {
                $('.copy-referral').text('COPIED');
            }, function () {
                console.log('error copying');
        });
    }
})

.controller('SearchCtrl', function($scope, $ionicSideMenuDelegate, Stores, STORAGE_URL, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $scope.showStore = function(store) {
        Stores.load(store);   
    }
    
    $scope.searchfor = '';
    
    $scope.storesFilter = function(query) {
        $('.button-offers').addClass('button-stable');
        $('.button-offers').removeClass('button-positive');
        $('.button-stores').addClass('button-positive');
        $('.button-stores').removeClass('button-stable');
        $scope.searchStores(query);
    }
    
    $scope.offersFilter = function(query) {
        $('.button-stores').addClass('button-stable');
        $('.button-stores').removeClass('button-positive');
        $('.button-offers').addClass('button-positive');
        $('.button-offers').removeClass('button-stable');
        $scope.searchOffers(query);
    }
    
    $scope.search = function(query) {
        if($('.button-stores').hasClass('button-positive')) {
            $scope.searchStores(query);
        } else {
            $scope.searchOffers(query);
        }
    }
    
    $scope.searchOffers = function(query) {
        if(query.length > 2) {
            Stores.searchOffers(query).then(function (data) {
                $scope.result = data;
            });
            $scope.$watch('result', function (cast) {
                if(angular.isDefined(cast)) {
                    $scope.list = [];
                    $scope.deals = [];
                    var l = [];
                    if($scope.result.length < 20) {
                        var length = $scope.result.length;
                    } else {
                        var length = 20;
                    }
                    for(var i = 0; i < length; i++) {
                        $scope.deals = $scope.result;
                        var name = $scope.result[i].name;
                        var coupon = $scope.result[i].coupon;
                        var link = $scope.result[i].link;
                        var store_id = $scope.result[i].store_id;
                        var id = $scope.result[i].id;
                        var image = $scope.result[i].img50;
                        d = {
                                store_id: store_id,
                                id: id,
                                name: name,
                                coupon: coupon,
                                link: link
                            };
                        $scope.deals.push(d);
                    }
                }
            });
        } else {
            $scope.list = []; 
            $scope.deals = [];
        }
    }
    
    $scope.showDeal = function(deal) {
        Stores.loadDealFromSearch(deal);
    }
    
    $scope.searchStores = function(query) {
        if(query.length > 2) {
            Stores.search(query).then(function (data) {
                $scope.result = data;
            });
            $scope.$watch('result', function (cast) {
                if(angular.isDefined(cast)) {
                    $scope.list = [];
                    $scope.deals = [];
                    var l = [];
                    if($scope.result.length < 20) {
                        var length = $scope.result.length;
                    } else {
                        var length = 20;
                    }
                    for(var i = 0; i < length; i++) {
                        if($scope.result[i].cashbk_pct) {
                            var discount_print = 'Up to '+$scope.result[i].cashbk_pct+'% Back';
                            var percent = $scope.result[i].cashbk_pct+'%';
                            var type = 'Cash Back';
                        } else {
                            var discount_print = 'Up to 40% Savings';
                            var percent = '40%';
                            var type = 'Instant Savings';
                        }
                        l = {
                                store_id: $scope.result[i].store_id,
                                store_name: $scope.result[i].store_name,
                                image: STORAGE_URL+$scope.result[i].image150x90_filename,
                                discount_print: discount_print,
                                percent: percent,
                                type: type,
                                link: $scope.result[i].app_tracking_url
                            };
                        $scope.list.push(l);
                    }
                }
            });
        } else {
            $scope.list = [];  
            $scope.deals = [];
        }
    }
})

.controller('EarningsCtrl', function($rootScope, $scope, $ionicSideMenuDelegate, User, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    User.earnings().then(function (data) {
        $scope.result = data;
    });
    $scope.$watch('result', function (cast) {
        if(angular.isDefined(cast)) {
            $scope.pendingTotal = $scope.result.pendingTotal;
            $scope.dueTotal = $scope.result.dueTotal;
            $scope.paidTotal = $scope.result.paidTotal;
            $scope.contributedTotal = $scope.result.contributedTotal;
            
            $scope.pending = $scope.result.pending;
            $scope.due = $scope.result.due;
            $scope.paid = $scope.result.paid;
            $scope.contributed = $scope.result.contributed;
        }
    });
})

.controller('UpdateCtrl', function($rootScope, $scope, $ionicSideMenuDelegate, $location, User, States, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $scope.user = $rootScope.userObject;
    $scope.states = States.all();
    
    $scope.update = function(user) {
        User.update(user);
        $location.path('/menu/tabs/topstores');
    }
})

.controller('FaqsCtrl', function($scope, $ionicSideMenuDelegate, $http, $sce, API_URL, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $http.get(API_URL+'/api/help?token=12345').success(function(data) {
        $scope.faqs = $sce.trustAsHtml(data.text);
    });
})

.controller('SchoolsCtrl', function($scope, $ionicLoading) {
    
})

.controller('SchoolsGeoCtrl', function($scope, $ionicPopup, Schools, $ionicLoading, $cordovaGeolocation) {
    
    $scope.supportSchool = function(id, name) {
        Schools.support(id, name);
    }
    
    $scope.noSchools = false;

    $scope.init = function() {
        //$ionicLoading.show();
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                console.log(lat);
                console.log(lon);
                Schools.searchByGeo(lat, lon).then(function (data) {
                    $scope.result = data;
                    console.log($scope.result);
                    if($scope.result.length == 0) {
                        $scope.noSchools = true;
                    }
                });
            }, function(err) {
                console.log(err);
        });
    }
    $scope.init();
    
    $scope.$watch('result', function (cast) {
        if(angular.isDefined(cast)) {
            //console.log($scope.result);
            if($scope.result.length == 0) {
                $scope.list = [];
            } else {
                $scope.list = $scope.result;
                $scope.list.reverse();
            }
            //$ionicLoading.hide();
        }
    });
})

.controller('SchoolsZipCtrl', function($scope, Schools, $ionicLoading) {
    
    $scope.supportSchool = function(id, name) {
        Schools.support(id, name);
    }
    
    $scope.searchfor = '';
    
    $scope.search = function(zip) {
        $scope.noSchools = false;
        if(zip.length > 4) {
            Schools.searchByZip(zip).then(function (data) {
                $scope.result = data;
                if($scope.result.length == 0) {
                    $scope.noSchools = true;
                }
            });
        } else {
            $scope.result = [];
        }
        
        $scope.$watch('result', function (cast) {
            if(angular.isDefined(cast)) {
                if($scope.result.length == 0) {
                    $scope.list = [];
                } else {
                    $scope.list = $scope.result;
                    $scope.list.reverse();
                }
            }
        });
    }
})

.controller('SchoolsAddCtrl', function($rootScope, $scope, $location, $ionicPopup, Schools, States, $ionicLoading) {

    $scope.states = States.all();

    $scope.add = function(school) {
        console.log(school)
        if (typeof school != "undefined" && school.hasOwnProperty('name') && school.hasOwnProperty('city') && school.hasOwnProperty('state') && school.hasOwnProperty('zip')) { 
            Schools.add(school).then(function (data) {
                $scope.result = data;
            });
            
            $scope.$watch('result', function (cast) {
                if(angular.isDefined(cast)) {
                    if ($scope.result.msg != 'success') {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Oops!',
                            template: "We're sorry, there was an unexpected error. Please try again."
                        });
                    } else {
                        Schools.support($scope.result.group.id, $scope.result.group.name);
                    }
                }
            });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Oops!',
                template: 'Please fill out all fields!'
            });
        }
    }
})

.controller('WebViewCtrl', function($rootScope, $scope, $location, Stores, User, $ionicLoading) {

    $rootScope.$watch('currentStore', function () {
        $scope.store = $rootScope.currentStore;
        $scope.isFavorite = 0;
        for(var i = 0; i < $rootScope.userObject.favorite_ids; i++) {
            if($rootScope.userObject.favorite_ids[i] == $rootScope.currentStore.store_id) {
                $scope.isFavorite = 1;
                $('#favorite').addClass('is-favorite');
            }
        }
    });
    $rootScope.$watch('currentDeals', function () {
        $scope.deals = $rootScope.currentDeals;
        if($rootScope.currentDeals.length == 0) {
            $scope.deals_print = '0 Deals';
            $('.header-right').hide();
        } else if ($rootScope.currentDeals.length == 1) {
            $scope.deals_print = '1 Deal';
            $('.header-right').show();
        } else {
            $scope.deals_print = $rootScope.currentDeals.length+' Deals';
            $('.header-right').show();
        }
    });

    $scope.isOpen = 0;
    
    $scope.toggleRight = function() {
        if($scope.isOpen == 0) {
            $scope.isOpen = 1;
            $("article#screen").animate({'marginLeft' : "-80%"},"fast");
            $("article#menu-right").animate({'marginLeft' : "120%"},"fast");
            wizViewManager.hide('webView');
        } else {
            $scope.isOpen = 0;
            $("article#screen").animate({'marginRight' : "0px", 'marginLeft' : "0%"},"fast");
            $("article#menu-right").animate({'marginLeft' : "200%"},"fast");
            wizViewManager.show('webView');
        }
    }
    $scope.showDeal = function(link) {
        $scope.isOpen = 0;
        Stores.loadDeal(link);
    }
    $scope.close = function() {
        wizViewManager.remove('webView');
        $location.path('/menu/tabs/topstores');
    }
    $scope.back = function() {
        $('#backButton').addClass('ui-disabled');
        wizViewManager.goBack('webView',function() {});
    }
    $scope.forward = function() {
        $('#forwardButton').addClass('ui-disabled');
        wizViewManager.goForward('webView',function() {});
    }
    $scope.favorite = function() {
        if($scope.isFavorite == 1) {
            $scope.isFavorite = 0;
            $('#favorite').removeClass('is-favorite');
            User.removeFavorite($rootScope.currentStore.store_id);
        } else {
            $scope.isFavorite = 1;
            $('#favorite').addClass('is-favorite');
            User.addFavorite($rootScope.currentStore.store_id);
        }
    }
});
