/*
 * Copyright (c) 2017 OBiBa. All rights reserved.
 *
 * This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

function NgObibaMicaListsOptionsFactory() {
  var defaultOptions = {
    listSearchOptions:{
      network: {
        fields: ['studyIds', 'acronym.*', 'name.*', 'description.*', 'logo']
      },
      study: {
        fields: ['logo', 'objectives.*', 'acronym.*', 'name.*', 'model.methods.design', 'model.numberOfParticipants.participant']
      },
      dataset: {
        fields: ['acronym.*', 'name.*', 'description.*', 'variableType',
          'studyTable.studyId',
          'studyTable.project',
          'studyTable.table',
          'studyTable.populationId',
          'studyTable.dataCollectionEventId',
          'harmonizationTable.studyId',
          'harmonizationTable.project',
          'harmonizationTable.table',
          'harmonizationTable.populationId'
        ]
      }
    },
    listOptions: {
      studyOptions: {
              studiesCountCaption: true,
              studiesSearchForm: true,
              studiesSupplInfoDetails: true,
              studiesTrimedDescrition: true
      }
    }
  };

  function NgObibaMicaListsOptions() {
    this.getOptions = function () {
      return defaultOptions;
    };
  }

  this.$get = function () {
    return new NgObibaMicaListsOptions();
  };

  this.setOptions = function (value) {
    Object.keys(value).forEach(function (option) {
      if(option in defaultOptions){
        defaultOptions[option] = value[option];
      }
    });
  };

}

function SortWidgetOptionsProvider() {
  var defaultOptions = {
    sortField: {
      options: [
        {
          value: '_score',
          label: 'relevance'
        },
        {
          value: 'name',
          label: 'name'
        },
        {
          value: 'acronym',
          label: 'acronym'
        }
      ],
      default: 'relevance'
    },
    orderField: {
      options: [
        {
          value: '',
          label: 'asc'
        },
        {
          value: '-',
          label: 'desc'
        }
      ],
      default: ''
    }
  };

  var self = this;

  function SortWidgetOptions(defaultOptions){
    var options = defaultOptions;
    this.getOptions = function() {
      return options;
    };
  }

  this.getDefaultOptions = function(){
    return self.defaultOptions;
  };

  this.$get = function () {
    return new SortWidgetOptions(defaultOptions);
  };

  this.setOptions = function (value) {
    Object.keys(value).forEach(function (optionKey) {
      if(optionKey in defaultOptions){
        if(value[optionKey].options){
          defaultOptions[optionKey].options = defaultOptions[optionKey].options.concat(value[optionKey].options);
          defaultOptions[optionKey].default = value[optionKey].default;
        }
      }
    });
  };
}

angular.module('obiba.mica.lists', ['obiba.mica.search'])
  .run()
  .config(['$provide', function($provide){
    $provide.provider('ngObibaMicaLists', NgObibaMicaListsOptionsFactory);
  }])
  .config(['ngObibaMicaSearchTemplateUrlProvider',
    function (ngObibaMicaSearchTemplateUrlProvider) {
      ngObibaMicaSearchTemplateUrlProvider.setTemplateUrl('searchStudiesResultTable', 'lists/views/list/studies-search-result-table-template.html');
      ngObibaMicaSearchTemplateUrlProvider.setTemplateUrl('searchNetworksResultTable', 'lists/views/list/networks-search-result-table-template.html');
      ngObibaMicaSearchTemplateUrlProvider.setTemplateUrl('searchDatasetsResultTable', 'lists/views/list/datasets-search-result-table-template.html');
      ngObibaMicaSearchTemplateUrlProvider.setTemplateUrl('searchResultList', 'lists/views/search-result-list-template.html');
    }])
  .config(['$provide', function($provide){
      $provide.provider('sortWidgetOptions', SortWidgetOptionsProvider);
    }])
  .filter('getBaseUrl', function () {
    return function (param) {
      return '/mica/' + param;
    };
  })
  .filter('doSearchQuery', function () {
    return function (type, query) {
      return '/mica/repository#/search?type=' + type + '&query=' + query + '&display=list';
    };
  })
  .filter('getLabel', function () {
    return function (SelectSort, valueSort) {
      var result = null;
      angular.forEach(SelectSort.options, function (value) {
        if (value.value.indexOf(valueSort) !== -1) {
          result = value.label;
        }
      });
      return result;
    };
  });
