/**
 * Created with JetBrains WebStorm.
 * User: lexi
 * Date: 6/15/13
 * Time: 6:37 PM
*/

'use strict';

angular.module('Login.services').factory('LoginService', function ($resource) {
    console.log("Initializing Login Service");
    return $resource('api/authenticate', {}, {
        authenticate: { method: 'POST' }
    });
});
