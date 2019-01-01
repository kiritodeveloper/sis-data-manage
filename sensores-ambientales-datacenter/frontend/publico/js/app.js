var serv_backend='http://127.0.0.1:3000';

var app = angular.module('app', ['ngRoute', 'angular-jwt']);

app.config(function($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['config', function(config) {
    if (config.url.substr(config.url.length - 5) == '.html') {
      return null;
    }
    return localStorage.getItem('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
		templateUrl: 'vistas/autenticar.html',
    controller: 'ctrlAutenticar'
	})
	.when('/app', {
		templateUrl: 'vistas/app.html',
    controller: 'ctrlApp'
	})
  .otherwise({
		redirectTo: '/'
	});
});

app.controller('ctrlAutenticar', function($scope, $location, $http) {
  $scope.autenticar = function(usuario) {
    if(typeof(usuario) != 'undefined') {
      if(usuario.usuario != '') {
        $http({
          method: 'POST',
          skipAuthorization: true,
          url: '/autenticar',
          data: usuario
        })
        .success(function(respuesta) {
          var token = respuesta.token;
          if(!window.localStorage.getItem('token')) {
            window.localStorage.setItem('token', token);
          }
          $location.path('/app');
        })
        .error(function(respuesta) {
          $scope.usuario.clave = '';
          $scope.msg = respuesta.msg;
        });
      }
      else {
        $scope.msg = 'Debe llenar el formulario';
      };
    }
    else {
      $scope.msg = 'Debe llenar el formulario';
    };
  }
});

app.controller('ctrlApp', function($scope, $http, $location) {
  var socket = '';

  $scope.salir = function() {
    if(window.localStorage.getItem('token')) {
      window.localStorage.removeItem('token');
    };
    socket.disconnect();
    $location.path('/');
  };

  $http({
    method: 'GET',
    skipAuthorization: false,
    url: '/app/actuadores/ultimo'
  })
  .success(function(actuadores, estado) {
    for(i in actuadores) {
      document.getElementById(actuadores[i].id).checked = Boolean(Number(actuadores[i].dato));
      actual = new Date(actuadores[i].fecha);
      fecha = '';
      if(actual.getDate() == new Date().getDate()) {
        fecha = 'Hoy ';
      }
      else if(actual.getDate() == new Date().getDate() - 1) {
        fecha = 'Ayer ';
      }
      fecha = fecha + 'a las ' + [actual.getHours(), ('0' + actual.getMinutes()).slice(-2)].join(':');
      document.getElementById([actuadores[i].id, 'fecha'].join('.')).innerHTML = fecha;
      switch(actuadores[i].id.substr(0,3)) {
        case 'ACO':
          if(Boolean(Number(actuadores[i].dato))) {
            document.getElementById([actuadores[i].id, 'icono'].join('.')).className = 'mdi-device-wifi-tethering';
          }
          else {
            document.getElementById([actuadores[i].id, 'icono'].join('.')).className = 'mdi-content-remove-circle-outline';
          };
          break;
        case 'EXT':
          if(Boolean(Number(actuadores[i].dato))) {
            document.getElementById([actuadores[i].id, 'icono'].join('.')).className = 'mdi-device-gps-fixed';
          }
          else {
            document.getElementById([actuadores[i].id, 'icono'].join('.')).className = 'mdi-toggle-radio-button-off';
          };
          break;
        default:
          console.log(actuadores[i].id);
      };
    };
  })
  .error(function(respuesta, cabecera) {
    $location.path('/');
  })
  .then(function() {
    socket = io.connect(serv_backend);

    var DHT22_AC02_FD05 = new JustGage({
      id: "DHT22_AC02_FD05",
      humanFriendlyDecimal: 2,
      decimals: 2,
      value: 0,
      min: 12,
      max: 23,
      title: "Rack AC02 inferior"
    });

    var DHT22_AC02_FD21 = new JustGage({
      id: "DHT22_AC02_FD21",
      humanFriendlyDecimal: 2,
      decimals: 2,
      value: 0,
      min: 12,
      max: 23,
      title: "Rack AC02 medio"
    });

    var DHT22_AC03_FD05 = new JustGage({
      id: "DHT22_AC03_FD05",
      humanFriendlyDecimal: 2,
      decimals: 2,
      value: 0,
      min: 12,
      max: 23,
      title: "Rack AC03 inferior"
    });

    var DHT22_AC03_FD21 = new JustGage({
      id: "DHT22_AC03_FD21",
      humanFriendlyDecimal: 2,
      decimals: 2,
      value: 0,
      min: 12,
      max: 23,
      title: "Rack AC03 medio"
    });

    socket.on('sensores', function(mensaje) {
      switch(mensaje.variable) {
        case 'temperatura':
          switch (mensaje.sensor) {
            case 'DHT22_AC02_FD05':
              DHT22_AC02_FD05.refresh(Number(mensaje.dato));
              break;
            case 'DHT22_AC02_FD21':
              DHT22_AC02_FD21.refresh(Number(mensaje.dato));
              break;
            case 'DHT22_AC03_FD05':
              DHT22_AC03_FD05.refresh(Number(mensaje.dato));
              break;
            case 'DHT22_AC03_FD21':
              DHT22_AC03_FD21.refresh(Number(mensaje.dato));
              break;
            default:
              console.log(mensaje);
          };
          break;
        default:
          console.log(mensaje);
      };
    });

    socket.on('actuadores', function (mensaje) {
      actual = new Date();
      fecha = '';
      if(actual.getDate() == new Date().getDate()) {
        fecha = 'Hoy ';
      }
      else if(actual.getDate() == new Date().getDate() - 1) {
        fecha = 'Ayer ';
      }
      fecha = fecha + 'a las ' + [actual.getHours(), ('0' + actual.getMinutes()).slice(-2)].join(':');
      document.getElementById([mensaje.actuador, 'fecha'].join('.')).innerHTML = fecha;
      document.getElementById(mensaje.actuador).checked = Boolean(Number(mensaje.dato));
      switch(mensaje.actuador.substr(0,3)) {
        case 'ACO':
          if(Boolean(Number(actuadores[i].dato))) {
            document.getElementById([mensaje.actuador, 'icono'].join('.')).className = 'mdi-device-wifi-tethering';
          }
          else {
            document.getElementById([mensaje.actuador, 'icono'].join('.')).className = 'mdi-content-remove-circle-outline';
          };
          break;
        case 'EXT':
          if(Boolean(Number(actuadores[i].dato))) {
            document.getElementById([mensaje.actuador, 'icono'].join('.')).className = 'mdi-device-gps-fixed';
          }
          else {
            document.getElementById([mensaje.actuador, 'icono'].join('.')).className = 'mdi-toggle-radio-button-off';
          };
          break;
        default:
          console.log(actuadores[i].id);
      };
    });
  });
});
