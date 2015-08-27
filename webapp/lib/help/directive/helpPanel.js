'use strict';

var fs = require('fs');

require('jquery');
var $ = window.jQuery;

var angular = require('angular');

var directiveTemplate = fs.readFileSync(__dirname + '/helpPanel.html', { encoding: 'utf-8' });

var HelpPanelController = [
    '$scope',
    '$compile',
    '$injector',
    '$sce',
    function(
        $scope,
        $compile,
        $injector,
        $sce
    ) {

        var workbench = $scope.workbench;


        $scope.searchResults = [];
        $scope.executeSearch = function() {
            var q = "q=" + encodeURIComponent($scope.searchQuery.replace(' ', '+'));
            var fragSize = 300; // length of snippet
            var getUrl = "http://ec2-52-19-129-229.eu-west-1.compute.amazonaws.com:8080/solr/" + "hackdays" + "/select?" + q + "&fl=title,link,type,id&wt=json&hl=true&hl.fl=text&hl.fragsize=" + fragSize;
            $scope.lastSearchQuery = $scope.searchQuery;

            console.log(getUrl);

            $.get(getUrl, function( data ) {
                console.log(JSON.parse(data));

                $scope.$apply(function () {
                    var queryResult = JSON.parse(data);
                    var docs = queryResult.response.docs;
                    var snippets = queryResult.highlighting;

                    $scope.searchResultCount = queryResult.response.numFound;
                    $scope.searchResults = [];

                    for (var i=0; i < docs.length; i++) {
                        var searchResult = {
                            title: docs[i].title,
                            link: docs[i].link,
                            isDocumentation: (docs[i].type=='Documentation'),
                            isForum: (docs[i].type=='Forum Discussion'),
                            isExample: (docs[i].type=='Example Project')                            
                        }
                        if (snippets[ docs[i].id ]) {
                             //$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(someHtmlVar);
                            searchResult.snippet = $sce.trustAsHtml(snippets[ docs[i].id ].text[0]);
                        }
                        $scope.searchResults.push( searchResult );
                    }
                });
            });            
        }

        function changeElement(element) {
            $scope.selectedElement = element;
            if (element){
                $scope.searchQuery = element.type.substring(5);
            }
            else {
                $scope.searchQuery = "";
            }

            $.get( "http://ec2-52-19-129-229.eu-west-1.compute.amazonaws.com:8080/best-practices/index.json", function( data ) {
                var results = [];
                if (element) {
                    for (var i = 0; i < data.length; i++) {
                        var bp = data[i];

                        for (var j = 0; j < data[i]['bpmnElements'].length; j++) {
                            if ("bpmn:" + data[i]['bpmnElements'][j] == element.type) {
                                results.push(data[i]);
                            }
                        }
                    }
                }

                $scope.$apply(function () {
                    $scope.bestPractices = results;
                });
            });



        }


        $scope.$watch(function() {
            if(!!workbench.diagramProvider) {
                return workbench.diagramProvider.getSelectedElements();
            }
        }, function(elementIds) {
            var element = null;
            if(elementIds.length === 1) {
                element = workbench.diagramProvider.getBpmnElement(elementIds[0]);
            }

            changeElement(element)
        });

}];


module.exports = function() {
    return {
        scope: {
            workbench : '='
        },
        controller: HelpPanelController,
        template: directiveTemplate
    };
};

