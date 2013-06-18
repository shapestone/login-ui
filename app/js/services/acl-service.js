/**
 * Created with JetBrains WebStorm.
 * User: lexi
 * Date: 6/15/13
 * Time: 6:00 PM
 */

'use strict';
/* Services */

angular.module('Login.services').factory('AclService', function ($resource) {
    console.log("Initializing AclService");
    return $resource('api/acl-controls', {}, {
        query: {method: 'GET', params: {}, isArray: false}
    });
});


