
//*********************************************************************************************************************************************************
// get record(s)
if ($getRequest) {

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






 // both, fetch expressions from both countries
    if ( $country!='both' && $country!='usa' && $country!='brazil' )   routeError();

    $language = (($country=='usa') ? 'english' : 'portuguese');

    if ( $resultformat=='reference')
      $sql =  "select $language as expression, item ".
              "from expressions  ".
              "where ifnull(active, false)= true and deleted_at is null ";

    if ( $resultformat=='json')
      $sql =  "select id, english, portuguese, item, ifnull(active, false) as active ".
              "from expressions  ".
              "where deleted_at is null ";

    // priority is filter whatever came from the searchbox
    if ($searchbox!='')  {
      $sql .= "and trim(item) like('%$searchbox%') or trim(portuguese) like('%$searchbox%') or trim(english) like('%$searchbox%') ";
    }

    // searchbox empty, filter by status
    else {

        if ($status=='active') $sql .= 'and ifnull(active, false)=true';
        else if ($status=='inactive') $sql .= 'and ifnull(active, false)=false';
        else if ($status=='all') $sql .= '';
        else $sql .= ' and 1=2';  // no status received
    }

    $sql .= ' order by item';

    // 3th parameter, true= specific to 'expressions', it prepares the result specific way to ease frontend's life
    if ( $resultformat=='reference')
      executeFetchQueryAndReturnJsonResult( $sql, false, true );

    if ( $resultformat=='json')
      executeFetchQueryAndReturnJsonResult( $sql, false, false );
  }
