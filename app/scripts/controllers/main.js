'use strict';

/**
 * @ngdoc function
 * @name angularLabApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularLabApp
 */
angular
  .module('angularLabApp')
  .controller('MainCtrl', ['$scope', '$q', mainCtrl]);

function mainCtrl($scope, $q) {
  var myData = [
    {
      document: '0',
      children: [
        {
          document: '0-0',
          children: [
            {
              document: '0-0-0',
              children: [
                {
                  document: '0-0-0-0',
                },
                {
                  document: '0-0-0-1'
                },
                {
                  document: '0-0-0-2'
                }
              ]
            },
            {
              document: '0-0-1'
            },
            {
              document: '0-0-2'
            }
          ]
        },
        {
          document: '0-1'
        },
        {
          document: '0-2'
        }
      ]
    },
    {
      document: '1',
      children: [
        {
          document: '1-0',
        },
        {
          document: '1-1'
        },
        {
          document: '1-2'
        }
      ]
    }
  ];

  $scope.myData = JSON.stringify(myData);

  function compileNode(node, parent) {
    console.log('compiling node: ' + node.document);
    return $q(function(resolve, reject) {
      setTimeout(function() {
        if (node.document) {
          node.level = parent.level + 1;
          resolve('<div>' + node.document + 'with level ' + node.level + '</div>');
        } else {
          reject('cannot compile a node without document');
        }
      }, 1000);
    });
  }

  var walk = function(node, done) {
    var results = [];

    if (!node.children) return done(err);
    var pending = node.children.length;
    if (!pending) return done(null, results);

    node.children.forEach(function(child) {

      // compileNode
      compileNode(child, node).then(function(compiledNode) {

        results.push(compiledNode);
        if (child && child.children) {
          walk(child, function(err, res) {
            console.log('concat: ');
            console.dir(res);
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (!--pending) done(null, results);
        }
      })
    });

  };

  myData[0].level = -1;

  walk(myData[0], function(err, results) {
    if (err) throw err;
    $scope.compiledNodes = results.join('');
  });
}
