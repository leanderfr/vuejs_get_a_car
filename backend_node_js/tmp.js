
//*********************************************************************************************************************************************************
// get record(s)
if ($getRequest) {

  
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




   // the date format depends on the country informed by the frontend
    $sql = " select booking.driver_name,  booking.car_id, concat('car_', car.id, '.png?$tempLink') as car_image, " .
          " if('$country'='usa', date_format(pickup_datetime, '%m/%d/%y'), date_format(pickup_datetime, '%d/%m/%y')) as pickup_date,   " .
          " if('$country'='usa', date_format(dropoff_datetime, '%m/%d/%y'), date_format(dropoff_datetime, '%d/%m/%y')) as dropoff_date,   " .
          " if('$country'='usa', date_format(pickup_datetime, '%h:%i - %p'), date_format(pickup_datetime, '%H:%i')) as pickup_hour,   " .
          " if('$country'='usa', date_format(dropoff_datetime, '%h:%i - %p'), date_format(dropoff_datetime, '%H:%i')) as dropoff_hour,   " .
          " booking.id as booking_id ".
          " from booking ".
          " left join car on booking.car_id = car.id " .
          " where booking.id = $booking_id ";
