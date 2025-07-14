<?php
declare(strict_types=1);

header("Content-Type: text/html; charset=utf-8"); 

// headers that allows another url frontend making api calls to this backend
//  CORS = Cross-Origin Resource Sharing
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');       

$method = $_SERVER['REQUEST_METHOD'];

// OPTIONS= browser sent just a signal to check out
if ($method == "OPTIONS") {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header("HTTP/1.1 200 OK");
    die();
} 
header("HTTP/1.0 200 OK"); 


require 'setup.php';
require 'functions.php';
require __DIR__.'/vendor/autoload.php';
require "Router.php";
require "handlers/Expressions.php";  
require "handlers/Cars.php";  
require "handlers/Bookings.php";  


//********************************************************************
// analyse the received route and points what to do
//********************************************************************
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// prepare handlers
$handlerExpressions = new Expressions;
$handlerCars = new Cars;
$handlerBookings = new Bookings;

$router = new Router;

$getRequest = $_SERVER['REQUEST_METHOD']==='GET';
$postRequest = $_SERVER['REQUEST_METHOD']==='POST';
$patchRequest = $_SERVER['REQUEST_METHOD']==='PATCH';
$deleteRequest = $_SERVER['REQUEST_METHOD']==='DELETE';

//*********************************************************************************************************************************************************
// get record(s)
if ($getRequest) {

  // resultformat =>  json , returns as an array of json,     reference, returns as a simple keyed array,  expressions.tablename, expresssions.title, etc
  // with searchbox
  $router->Get("/expressions/{resultformat}/{country}/{status}/{searchbox}", function($resultformat, $country, $status, $searchbox) use($handlerExpressions) {  
    $handlerExpressions->getExpressions($resultformat, $country, $status, $searchbox);
  });

  // no searchbox
  $router->Get("/expressions/{resultformat}/{country}/{status}", function($resultformat, $country, $status) use($handlerExpressions) {  
    $handlerExpressions->getExpressions($resultformat, $country, $status, '');
  });


  $router->Get("/expression/{id}", function($id) use($handlerExpressions)  {  
    $handlerExpressions->getExpressionById($id);
  });

  // with searchbox
  $router->Get("/cars/{status}/{searchbox}", function($status, $searchbox) use($handlerCars)  {  
    $handlerCars->getCars($status, $searchbox);
  });

  // no searchbox
  $router->Get("/cars/{status}", function($status) use($handlerCars)  {  
    $handlerCars->getCars($status, '');
  });
  
  $router->Get("/car/{id}", function($id) use($handlerCars)  {  
    $handlerCars->getCarById($id);
  });


  $router->Get("/bookings/{country}/{car_id}/{firstday}/{lastday}", 
        function($country, $car_id, $firstday, $lastday) use($handlerBookings)  {  
    $handlerBookings->getBookingsByCarIdAndPeriod( $country, $car_id, $firstday, $lastday );
  });

  // need to inform country, because of the date format used in the query
  $router->Get("/booking/{country}/{id}", function($country, $id) use($handlerBookings)  {  
    $handlerBookings->getBookingById( $country, $id );
  });



}

//*********************************************************************************************************************************************************
// update record, bookings cannot be updated, just created or deleted
if ($patchRequest) {
    $router->Patch("/expression/{id}", function($id) use($handlerExpressions)  {  
      $handlerExpressions->postOrPatchExpression($id);
    });

    $router->Patch("/expressions/status/{id}", function($id) use($handlerExpressions)  {  
      $handlerExpressions->ChangeStatus($id);
    });

    $router->Patch("/car/{id}", function($id) use($handlerCars)  {  
      $handlerCars->postOrPatchCar($id);
    });

    $router->Patch("/booking/{id}", function($id) use($handlerBookings)  {  
      $handlerBookings->postOrPatchBooking($id);
    });


    $router->Patch("/cars/status/{id}", function($id) use($handlerCars)  {  
      $handlerCars->ChangeStatus($id);
    });



}


//*********************************************************************************************************************************************************
// add record
if ($postRequest)  {
    $router->Post("/expression", function() use($handlerExpressions)  {  
      $handlerExpressions->postOrPatchExpression();
    });

    $router->Post("/car", function() use($handlerCars)  {  
      $handlerCars->postOrPatchCar();
    });

    $router->Post("/booking", function() use($handlerBookings)  {  
      $handlerBookings->postOrPatchBooking();
    });
}

//*********************************************************************************************************************************************************
// delete record
// only bookings can be deleted, cars and expressions only deactivated
if ($deleteRequest) {

    $router->Delete("/booking/{booking_id}", function($id) use($handlerBookings)  {     
      $handlerBookings->deleteBooking($id);
    });
}


$router->dispatch($path);

//********************************************************************
//********************************************************************


?>