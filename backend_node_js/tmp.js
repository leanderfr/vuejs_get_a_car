
//*********************************************************************************************************************************************************
// get record(s)
if ($getRequest) {

  

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
//if ($patchRequest) {

//*********************************************************************************************************************************************************
// PHP prior than 8.4 doesnt deal with PATCH method!
//*********************************************************************************************************************************************************
if ($postRequest) {

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




    if ($country!='brazil' && $country!='usa' )   routeError('country');
        if (! is_numeric($car_id))   routeError('id');

    // generates random string to concatenate with the link to the car image and avoid browser cache
    $tempLink = rand(10000,99999);

    // the date format depends on the country informed by the frontend
    $sql = " select booking.driver_name,  booking.car_id, concat('car_', car.id, '.png?$tempLink') as car_image, " .
          " if('$country'='usa', date_format(pickup_datetime, '%m/%d %h:%i - %p'), date_format(pickup_datetime, '%d/%m - %H:%i')) as pickup_formatted,   " .
          " if('$country'='usa', date_format(dropoff_datetime, '%m/%d %h:%i - %p'), date_format(dropoff_datetime, '%d/%m - %H:%i')) as dropoff_formatted,   " .
          " date_format(pickup_datetime, '%Y-%m-%d|%H:%i') as pickup_reference,   date_format(dropoff_datetime, '%Y-%m-%d|%H:%i') as dropoff_reference, " .
          " booking.id as booking_id ".
          " from booking ".
          " left join car on booking.car_id = car.id " .
          " where 1=1 ";

  // car_id = 0, frontend asks to list all cars reservations, no filter
        if ($car_id == '0') {
        }
        // user defined which car to list
        if ($car_id != '0') {
                $sql .= " and booking.car_id = $car_id ";
  }

  $sql .= " and (DATE_FORMAT(pickup_datetime,'%Y-%m-%d') between '$firstday' and '$lastday' or DATE_FORMAT(dropoff_datetime,'%Y-%m-%d') between '$firstday' and '$lastday') ";
  $sql .= " AND booking.deleted_at IS null ";

   /*
    result example that will be sent to front
    [
        {
            "booking_id": 56,
            "car_id": 1462,
            "pickup_formatted": "27/01 - 16:30",
            "pickup_reference": "2025-01-27|16:30",
            "dropoff_formatted": "28/01 - 11:30",
            "dropoff_reference": "2025-01-28|11:30",
            "driver_name": "Peter ",
            "car_image": "Accomplished_car_001462.png"
        },
        {
            "booking_id": 57,
            "car_id": 1462,
            "pickup_formatted": "30/01 - 11:45",
            "pickup_reference": "2025-01-30|11:45",
            "dropoff_formatted": "30/01 - 16:20",
            "dropoff_reference": "2025-01-30|16:20",
            "driver_name": "Liliana",
            "car_image": "Accomplished_car_001462.png"
        }
    ]
    */

    executeFetchQueryAndReturnJsonResult( $sql, false, false );