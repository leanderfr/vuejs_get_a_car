
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


<?php

class Expressions
{

  //***************************************************************************************************************************************
  //***************************************************************************************************************************************

  public function getExpressions(string $resultformat, string $country, string $status, string $searchbox): void   {

    // both, fetch expressions from both countries
    if ( $country!='both' && $country!='usa' && $country!='brazil' )   routeError();

    $language = (($country=='usa') ? 'english' : 'portuguese');

    if ( $resultformat=='reference')
      $sql =  "select $language as expression, item ".
              "from expression  ".
              "where ifnull(active, false)= true and deleted_at is null ";
  
    if ( $resultformat=='json')    
      $sql =  "select id, english, portuguese, item, ifnull(active, false) as active ".
              "from expression  ".
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

  //***************************************************************************************************************************************
  //***************************************************************************************************************************************

  public function getExpressionById($id=""): void   {

    if (! is_numeric($id)) {
      internalError( 'Not numeric' );
    }


    $sql =  "select item, english, portuguese  ".
            "from expression  ".
            "where id = $id ";

    executeFetchQueryAndReturnJsonResult( $sql, true);
  }
 




  //***************************************************************************************************************************************
  //***************************************************************************************************************************************
  public function changeStatus($id=''): void    {
    global $dbConnection;


    if (! is_numeric($id)) {
      internalError( 'Not numeric' );
    }

    $crudSql = "update expression set active = if(active, false, true) where id = $id ";
    $dbConnection -> autocommit(true);    // record without need to transaction

    $result = executeCrudQueryAndReturnResult($crudSql, true);    

    http_response_code(200);   // 200= it was ok
    die( '__success__' );
  }



  //***************************************************************************************************************************************
  //***************************************************************************************************************************************
  public function postOrPatchExpression($expression_id=''): void   {
    global $dbConnection;

    // only method PATCH will worry about record_id, method POST, wont
  	if ($expression_id!='' && ! is_numeric($expression_id))   routeError();

    // verify request
    $fields = [ ['string', 'item', 5, 30]  ,
                ['string', 'english', 3, 200],
                ['string', 'portuguese', 3, 200] 
              ];

    // if it is posting ($expression_id==''), get the usual $_POST from php
    if ($expression_id=='')    {
//      $_FIELDS = $_POST;
    }

    // otherwise, use the PHP 8.4 request_parse_body() 
    else {
//      [$_FIELDS] = request_parse_body();
    }

    $_FIELDS = $_POST;

    $dataError = '';
    for ($i=0; $i < count($fields); $i++)  {

      $fieldType = $fields[$i][0];
      $fieldName = $fields[$i][1];
      $minSize = $fields[$i][2];
      $maxSize = $fields[$i][3];

      $fieldValue = $_FIELDS[$fieldName];

      // is numeric
      if ($fields[$i][0] == 'int') {
        if (! is_numeric($fieldValue)) {
          $dataError = 'Not numeric';
          break;
        }
      }

      // min / max sizes
      if ($fieldType=='string') {
          if ( strlen($fieldValue) < $minSize || strlen($fieldValue) > $maxSize )  {
            $dataError = $fieldName . ' - String size error';
            break;
          }
      }
    }

    if ($dataError!='') internalError( $dataError );

    $item =   addslashes($_FIELDS['item']);
    $english =   addslashes($_FIELDS['english']);
    $portuguese =   addslashes($_FIELDS['portuguese']);

    // if no ID's been informed, its a POST, new record
    if ($expression_id=='')    {
      $crudSql = "insert into expression(item, english, portuguese, created_at, updated_at, active) ". 
                "select '$item', '$english', '$portuguese', now(), now(), true "; 
      $dbOperation = 'insert';
    }

    // if ID's been informed, its a PATCH, update
    else {
      $crudSql = "update expression set item='$item', english='$english', portuguese='$portuguese', updated_at=now() ". 
                "where id = $expression_id ";
      $dbOperation = 'update';
    }
    $dbConnection -> autocommit(true);    // record without need to transaction

    // execute query and get the ID of the just handled expression
    $result = executeCrudQueryAndReturnResult($crudSql, true);    

    // if it was a POST, obtain the id  (__success__|record id)
    if ($expression_id=='') {
      $expression_id = explode("|", $result)[1];
    }

    http_response_code(200);   // 200= it was ok
    if ($dbOperation == 'update')   die( '__success__' );
    else die( $result );    // __success__|id registro

  }


}