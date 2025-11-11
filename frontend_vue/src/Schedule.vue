scheduleContainer
<template>

  <div class='flex flex-col h-full ' id='scheduleContainer'>

    <!-- top tool bar -->
    <div class="flex flex-row h-[60px] w-full justify-between border-b-2 " id='scheduleToolbar'>

      <!-- current year -->
      <div class="flex flex-row text-[30px] font-bold pt-3 pl-6" id='currentYear'></div>


      <!-- action buttons -->
      <div class="flex flex-row pt-1">
          <!-- new booking -->
          <div  class='btnBOOKING_ADD_CAR_RESERVATION putPrettierTooltip'  :title="expressions.new_booking"   @click="forceHideToolTip();newBookingRecord()" aria-hidden="true"></div>   

          <!-- display calendar -->
          <div  class='btnBOOKING_CALENDAR putPrettierTooltip' :title="expressions.choose_date" @click="forceHideToolTip();showCalendar=true" aria-hidden="true"></div>    

          <!-- display all the cars reservations -->
          <div  class='btnBOOKING_ALL_CARS putPrettierTooltip'  :class="{btnBOOKING_ALL_CARS_ACTIVE: props.selectedCar==0}"
                :title="expressions.display_all_cars" 
                @click="forceHideToolTip();emit('setNewSelectedCar', 0)"  aria-hidden="true"></div>    

          <!-- back 1 week   -->
          <div  class='btnBOOKING_LEFT_ARROW putPrettierTooltip'  :title="expressions.previous_week" @click="forceHideToolTip();browseBookingCalendar(-7)" aria-hidden="true"></div>   
          <!-- forward 1 week -->
          <div  class='btnBOOKING_RIGHT_ARROW putPrettierTooltip' :title="expressions.next_week" @click="forceHideToolTip();browseBookingCalendar(+7)" aria-hidden="true"></div>   

          <!-- cars table -->
          <div  class='btnCARS_TABLE putPrettierTooltip' 
              :title="expressions.cars" 
              @click="forceHideToolTip();emit('setDatatableToDisplay', 'cars')" 
              aria-hidden="true"></div>   

          <!-- expressions table -->
          <div  class='btnEXPRESSIONS_TABLE putPrettierTooltip' 
              :title="expressions.expressions" 
              @click="forceHideToolTip();emit('setDatatableToDisplay', 'expressions')" 
              aria-hidden="true"></div>   

      </div> 

    </div>

    <!-- week days  -->
    <div class="w-full border-b-2 border-b-gray-300 text-lg py-1 " id='scheduleHeader' >  
        <div class="w-[calc(100%-22px)] flex flex-row text-gray-500  text-lg font-bold text-center h-12 justify-center cursor-pointer items-center" >
          <div class='w-[9%] tdBookingHeader'>&nbsp;</div>
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn0' bookings_this_day='' real_date=''>s</div> 
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn1' bookings_this_day='' real_date=''></div>
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn2' bookings_this_day='' real_date=''></div>
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn3' bookings_this_day='' real_date=''></div>
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn4' bookings_this_day='' real_date=''></div> 
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn5' bookings_this_day='' real_date=''></div>
          <div class='w-[13%] tdBookingHeader rounded-2xl' id='datecolumn6' bookings_this_day='' real_date=''></div>
        </div>
    </div>

    <!-- loop to display times from 05:00 to 23:00  -->
    <div class="w-full flex flex-col  overflow-y-scroll h-[1px]   border-gray-500 relative  border-2 " id='bookingsTable' alreadyFitToScreen='no'>  

      <div v-for="hour in counter(5, 23)" :key="hour" class="w-full flex flex-row  leading-[60px]  justify-center cursor-pointer border-b-2 border-gray-300 hover:bg-gray-100"  >
        <div class='w-[9%] tdBookingCell flex justify-center'>{{ hourFormat(hour, currentCountry) }}</div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay0' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay1' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay2' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay3' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay4' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay5' + hour"></div>
        <div class='w-[13%] tdBookingCell' :id="'bookingHourDay6' + hour"></div>
      </div>

    </div>

    <!-- help to pick date -->
    <div id="divCALENDAR"></div>
    <input type='hidden' id='lastChosenDate' value='' class="datepicker" style='visibility:hidden' /> 

    <div v-if="showBookingForm" id='backDrop' class='w-full h-full  absolute flex items-center justify-center left-0 top-0 z-10 bg-[rgba(0,0,0,0.5)]' @click.self='closeBookingForm' aria-hidden="true"  >  
      <BookingForm 
          :expressions='expressions' 
          :backendUrl='backendUrl' 
          :currentCountry='currentCountry' 
          :bookingIdEdit='bookingIdEdit'
          :imagesUrl='props.imagesUrl'
          :formHttpMethodApply = 'formHttpMethodApply'  
          @closeBookingForm="showBookingForm=false" 
          @showLoading="emit('showLoading')" 
          @hideLoading="emit('hideLoading')" 
          @refreshBookingDatesAndContent = "refreshBookingDatesAndContent"   />
    </div>

  
  </div>

  

</template>


<script setup>

import { onMounted, ref , onBeforeMount  } from 'vue';
import BookingForm from './BookingForm.vue';
import { slidingMessage, forceHideToolTip, hourFormat, counter, divStillVisible, loadScripts, improveTooltipLook  } from './assets/js/utils.js'

//const showLoading = defineEmits( ['showLoading'] );
//const hideLoading = defineEmits( ['hideLoading'] );

const emit = defineEmits( ['showLoading', 'hideLoading','setNewSelectedCar', 'setDatatableToDisplay'] );

const props = defineProps( ['expressions', 'currentCountry', 'backendUrl', 'imagesUrl', 'selectedCar' ] )

// date picker
const datePicker = ref(null)
const showBookingForm = ref(false)

// id of the current booking being edited or viewed
const bookingIdEdit = ref(null)

// method being used with the booking form
const formHttpMethodApply = ref(null)

// the post it <div> of the reservation can be moved or clicked, when it is being dragged, the variable 'draggingBookingDivYet', 
// deactivate temporarely the 'click'  event
let draggingBookingDivYet = false




  //***************************************************************************
  // load crucial js before anything
  //***************************************************************************
  onBeforeMount( () => {

    var scriptsToLoad = [
    ]

    loadScripts(scriptsToLoad).done(function() {
      
    });
  })

//*****************************************************************************
//*****************************************************************************

onMounted( () => {
  refreshBookingDatesAndContent()  // start displaying dates from current week and its reservations
  setTimeout(() => {
    prepareCalendar()  
  }, 1000);  

  improveTooltipLook();

  // prepare de choose date button 
  $('.btnBOOKING_CALENDAR').on('click', function(event) {
    event.stopPropagation();
    datePicker.value.open();  
  }).on('mousedown', function(event) { event.preventDefault(); });
})


// BookingCalendar_CurrentDate will be used to control current week
let today = new Date(); 
let _today_ = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let BookingCalendar_CurrentDate = _today_;



/************************************************************************************************************************************************************
 BookingCalendar_CurrentDate ==>  starts with today
 BookingCalendar_CurrentDate will be updated as the user backs or forwards weeks
************************************************************************************************************************************************************/

async function refreshBookingDatesAndContent() { 

  emit('showLoading')


  // necessario abrir evento assincrono para exibir div ajax loading, caso contrario navegador nao atualiza a tela
  //setTimeout(() => {showLoadingGif(); }, 1);

  let currentDate = new Date(BookingCalendar_CurrentDate.getFullYear(), BookingCalendar_CurrentDate.getMonth(), BookingCalendar_CurrentDate.getDate());

  let options = {month: '2-digit', day: '2-digit'} 

  // get back until finding the last sunday before current date (BookingCalendar_CurrentDate)
  while (currentDate.getDay()!=0)  {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // obtain weekday (3 letters) and the date itself
  let weekday, weekday_str

  let weekdays =  {0: props.expressions.sunday_short, 1: props.expressions.monday_short, 2: props.expressions.tuesday_short, 3: props.expressions.wednesday_short, 
                    4: props.expressions.thursday_short, 5: props.expressions.friday_short, 6: props.expressions.saturday_short} 

  
  let today = new Date();  
  let _today_ = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  //let options = {month: '2-digit', day: '2-digit'} 

  let displayedYears = []

  let firstDayWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let lastDayWeek

  for (weekday=0; weekday<7; weekday++) {

    lastDayWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    weekday_str = weekdays[weekday]

    // display the date in its own '<div>'
    if ( props.currentCountry == 'usa') 
      $(`#datecolumn${weekday}`).html( weekday_str + ' ' +currentDate.toLocaleDateString('en-us', options ))    // mm/dd
    else 
      $(`#datecolumn${weekday}`).html( weekday_str + ' ' + currentDate.toLocaleDateString( 'pt-br', options ))  // dd/mm

    // use the 'invented' property  'realDate' to save the real date of the column
    $(`#datecolumn${weekday}`).attr('real_date', currentDate.toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})  )    // yyyy-mm-dd

    // puts today in border red
    if (currentDate.getTime() == _today_.getTime()) {
      $(`#datecolumn${weekday}`).css('border-color', 'blue')
      $(`#datecolumn${weekday}`).attr('today', 'true')
    } else {
      $(`#datecolumn${weekday}`).css('border-color', 'transparent')
      $(`#datecolumn${weekday}`).attr('today', 'false')
    }

    // user puts/takes out mouse over the date <div>
    $(`#datecolumn${weekday}`).on('mouseleave', function()   {       
        if ( $(this).attr('today')!='true' )   $(this).css("border-color","transparent")
    });      
    $(`#datecolumn${weekday}`).on('mouseenter', function()   {       
        if ( $(this).attr('today')!='true' )   $(this).css("border-color","black")
        else    $(this).css("border-color","blue")
    });      

    // concatenate curtrent year to display in the title of the schedule
    if (displayedYears.indexOf(currentDate.getFullYear())==-1)  displayedYears.push(currentDate.getFullYear()  )

    // forward 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }


  // if the week is between 2 years, display both years 
  let _displayedYears_ = ''
  let y
  for (y=0; y<displayedYears.length; y++) {
    if (_displayedYears_!='')  _displayedYears_ += ' / '
    _displayedYears_ += displayedYears[y]
  }

  $('#currentYear').html(_displayedYears_)

  let __firstDayWeek = firstDayWeek.toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})    
  let __lastDayWeek = lastDayWeek.toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})    

  // *********************************************************************************************************************************
  // load the reservations (backend) of the week being viewed
  // *********************************************************************************************************************************

  try {
      let _route_ = `${props.backendUrl}/bookings/${props.currentCountry}/${props.selectedCar}/${__firstDayWeek}/${__lastDayWeek}`
      await fetch(_route_, {method: 'GET'})

      .then( (response) => {

        if (!response.ok) {
          return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
        }
        return response.json();
      })

      .then( (bookings) => {
        emit('hideLoading')

        // example of result json
        /*
        [
            {
                "booking_id": 19,
                "car_id": 7,
                "pickup_formatted": "04/12 09:30",
                "pickup_reference": "2024-12-04|09:30",
                "dropoff_formatted": "05/12 15:00",
                "dropoff_reference": "2024-12-05|15:00",
                "driver_name": "teste 1",
                "car_image": "car_000007.png"
            },
            {
                "booking_id": 20,
                "car_id": 7,
                "pickup_formatted": "04/12 08:55",
                "pickup_reference": "2024-12-04|08:55",
                "dropoff_formatted": "06/12 18:30",
                "dropoff_reference": "2024-12-06|18:30",
                "driver_name": "agora vai",
                "car_image": "car_000007.png"
            }
        ]
        */


        // coloca na propriedade (inventada) 'bookings_this_day', contida no header de cada coluna de dia da semana, 
        // as reservas feitas para aquele dia, dessa forma o jscript vai poder mais adiante exibir <div>'s com as reservas naquela coluna

        // as reservas do dia serao concatenadas em um string, cada reserva separada por '^', e cada campo da reserva, separado por '|'
        // e colocadas na propriedade (inventada) 'bookings_this_day'

        let bookingsThisDay 
        let weekday

        // remove informacao usada antes, sobre quais reservas devem ser exibidas em cada coluna de dia da semana
        for (weekday=0; weekday<7; weekday++) {
          $(`#datecolumn${weekday}`).attr('bookings_this_day','') 
        }

        let availableColors = [ ['rgb(204, 224, 255)', 'rgb(77, 148, 255)'],
                                    ['rgb(214, 245, 214)', 'rgb(0, 128, 0)'],
                                    ['rgb(255, 235, 204)', 'rgb(255, 165, 0)'],
                                    ['rgb(255, 235, 230)', 'rgb(255, 0, 0)'],
                                    ['rgb(242, 230, 217)', 'rgb(172, 115, 57)'] ]
        let whichColor = 0

        for (let bks = 0; bks < bookings.length; bks++)   {
        
            let pickup = bookings[bks]['pickup_reference'].split('|')[0].split('-')   // pega a data yyyy-mm-dd   (pickup_reference= yyyy-mm-dd|HH:mm)
            let dropoff = bookings[bks]['dropoff_reference'].split('|')[0].split('-')

            let _pickup = new Date(pickup[0], parseInt(pickup[1], 10)-1, pickup[2]);
            let _dropoff = new Date(dropoff[0], parseInt(dropoff[1], 10)-1, dropoff[2]); 

            let pickupHour = bookings[bks]['pickup_reference'].split('|')[1]   // pega a hora HH:mm   (pickup_reference= yyyy-mm-dd|HH:mm)
            let dropoffHour = bookings[bks]['dropoff_reference'].split('|')[1]

            // percorre cada dia da semana e verifica se a reserva atual deve ser exibida no dia
            let currentDay = new Date(firstDayWeek.getFullYear(), firstDayWeek.getMonth(), firstDayWeek.getDate());


            for (weekday=0; weekday<7; weekday++) {

              // se a data da coluna atual esta dentro do intervalo da reserva sendo lida, registra (bookings_this_day) que a <div> da reserva deve aparecer aqui
              // o tamanho da <div> vai depender da qtde de horas reservadas no dia atual
              if (currentDay >= _pickup && currentDay <= _dropoff)   {

                bookingsThisDay = $(`#datecolumn${weekday}`).attr('bookings_this_day') 

                // se o inicio de reserva nao é no dia atual, considera reservado desde o começo do dia (05:00), pois ela comecou em um dia anterior ao atual
                let startingHour = 5, startingMinute = 0                  

                // se o inicio da reserva é o dia atual, obtem a hora do inicio para informar ao jscript onde iniciar a exibicao da <div> com a reserva
                if (currentDay.getTime() == _pickup.getTime())  {
                  startingHour = parseInt( pickupHour.substring(0,2), 10)  // obtem o numero da hora inicial (HH)
                  startingMinute = parseInt( pickupHour.substring(3), 10)  // obtem o minuto inicial (mm)  
                }

                // se o fim de reserva nao é no dia atual, considera reservado ate o fim do dia (23:59), pois ela terminará somente em um dia posterior ao atual
                // usa a hora invalida 24 para avisar o algoritmo que essa reserva nao terminara no dia atual, só em um proximo dia
                let endingHour = 24, endingMinute = 0
                // se o fim da reserva é o dia atual, obtem a hora do fim para informar ao jscript onde finalizar a exibicao da <div> com a reserva
                if (currentDay.getTime() == _dropoff.getTime())  {
                  endingHour = parseInt( dropoffHour.substring(0,2), 10 )  // obtem o numero da hora final  (HH)
                  endingMinute = parseInt( dropoffHour.substring(3), 10 )  // obtem o minuto da hora final  (mm)
                }

                bookingsThisDay += bookingsThisDay=='' ? '' : '^'
                bookingsThisDay +=  bookings[bks]['booking_id'] + '|' + 
                                    bookings[bks]['car_id'] + '|' +  
                                    bookings[bks]['pickup_formatted'] + '|' + 
                                    bookings[bks]['dropoff_formatted'] + '|' + 
                                    bookings[bks]['driver_name'] + '|' +
                                    startingHour + '|' + startingMinute + '|' +
                                    endingHour + '|' + endingMinute + '|' +
                                    bookings[bks]['car_image'] + '|' +
                                    availableColors[whichColor][0] + '|' + availableColors[whichColor][1]    // bgcolor|border color

                // memoriza que na coluna de data atual, esta reserva deve ser exibida
                $(`#datecolumn${weekday}`).attr('bookings_this_day', bookingsThisDay) 
              }

              // avanca 1 dia
              currentDay.setDate(currentDay.getDate() + 1);
            }
            whichColor = (whichColor < availableColors.length-1) ? (whichColor + 1) : 0   // pega proxima cor didsponivel para <div>
        }

        // exibe as <div>'s de reserva 
        postItBookingDivs()

        while (divStillVisible('#bookingsTable') ) {
            $('#bookingsTable').height( $('#bookingsTable').height()+10 );     
        }



//console.log(divStillVisible('#headerLogo'))
    })

  } 
  catch(err) {
    emit('hideLoading')
    throw new Error(`Bookings Prepare Err Fatal= ${err.message}`);
  }
 
}

/************************************************************************************************************************************************************
back/forward week 
************************************************************************************************************************************************************/
const browseBookingCalendar = (days) => {
  // obtain month/year of the date being handled currently
  let tmpDate = new Date(BookingCalendar_CurrentDate.getFullYear(), BookingCalendar_CurrentDate.getMonth(), BookingCalendar_CurrentDate.getDate());
  tmpDate.setDate(tmpDate.getDate() + days);

  BookingCalendar_CurrentDate = tmpDate

  refreshBookingDatesAndContent()
}


/************************************************************************************************************************************************************
prepare calendar to choose date
************************************************************************************************************************************************************/
function prepareCalendar() {

let months , weekdays, _today_, _close_

if (props.currentCountry == 'usa') {
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] ,
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  _today_ = 'Today'
  _close_ = 'Close'
} else {
  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] ,
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  _today_ = 'Hoje'
  _close_ = 'Fechar'
}
var $input = $( '.datepicker' ).pickadate({
  formatSubmit: 'dd/mm/yy',  
  container: '#divCALENDAR', 
  format: 'dd/mm/yyyy',  
  monthsFull: months,
  weekdaysShort: weekdays,
  today: _today_,
  clear: '',  
  close: _close_,
  closeOnSelect: true,  
  onClose: function() {     

    // here, user closed the calendar 

    let chosenDate =  datePicker.value.get()   // dd/mm/yyyy 

    let currentDate = new Date(BookingCalendar_CurrentDate.getFullYear(), BookingCalendar_CurrentDate.getMonth(), BookingCalendar_CurrentDate.getDate());
    let _currentDate_ = currentDate.toLocaleDateString( 'pt-br' )

    // if user closed the calendar but chosen a date

    if (chosenDate != _currentDate_ && chosenDate!='' && _currentDate_!='') {     
      BookingCalendar_CurrentDate = new Date(parseInt(chosenDate.substring(6, 10), 10), 
                      parseInt(chosenDate.substring(3, 5), 10)-1,
                      parseInt(chosenDate.substring(0, 2), 10) );      
      $('#lastChosenDateGotFocus').focus();
      refreshBookingDatesAndContent()
    }    

    // put the focus on the table, the component Datepicker.js insists in re(open) alone sometimes
    setTimeout(() => {
      $('#bookingsTable').focus()  
    }, 1000);

  } 
});

datePicker.value = $input.pickadate('picker')
}
 

/************************************************************************************************************************************************************
display the post it's (<div>'s) with the reservation data obtained through API
************************************************************************************************************************************************************/

const postItBookingDivs = () => {



  let $bookingsTable = $('#bookingsTable') 
  $bookingsTable.scrollTop(0)

  let divCount = 0

  // remove old <div>'s with reservations created before
  $('.bookTemporaryDiv').off('click')  
  $('.bookTemporaryDiv').remove()


  for (let weekday=0; weekday<7; weekday++) {

    /* example of 'bookings_this_day'

    monday column example:
      bookings_this_day="Car 1 name|11|03/06/2025 05:00|03/06/2025 11:35|myself the driver|5|0|11|35^Car 2 name|9|10/06/2025 19:00|11/06/2025 19:30|me again driving|19|0|19|30^Titano|7.......

    */

    let bookingsThisDay = $(`#datecolumn${weekday}`).attr('bookings_this_day') 
    if (bookingsThisDay=='') continue

    let bookings = bookingsThisDay.split('^')   // separador de reservas

    // memorize bookings ID's to help creating the 'draggable event, below
    let bookingsIDs = []

    // read the bookings made to the current weekday
    for (let bks=0; bks < bookings.length; bks++)  {

      let booking = bookings[bks].split('|')   // booking fields separator

      let startingHour = booking[5]
      let startingMinute = booking[6]

      let endingHour = booking[7]
      let endingMinute = booking[8]

      // convert hours/minutes to the position of the respective row (div) in the schedule
      let tableRowBookingTop = startingHour - 5    // 5= initial hour of the day, 05:00
      let tableRowBookingBottom = endingHour - 5


      // the <div> que contains the schedule (bookingsTable), has children  <div>'s filhas for each hour (from 05:00 to 23:00)
      // and each hour has children DIVs with the weekdays (mon - fri)

      let $divBookingTop = $bookingsTable.children().eq(tableRowBookingTop).children().eq(weekday+1)      // weekday+1 because of the hour column
      let $divBookingBottom = $bookingsTable.children().eq(tableRowBookingBottom).children().eq(weekday+1)

      let bookDivWidth = $divBookingTop.width() 

      // endingHour= 24 means the booking wont end today, will keep next day

      let pickupMoment = booking[2]
      let dropoffMoment = booking[3]

      let carImage = booking[9]
      let driverName = booking[4]

      let bookingHtml = `<div style='display:flex;flex-direction:column;'>`+
                        `   <div style='display:flex;flex-direction:row;justify-content: space-between;margin-bottom:20px;align-items: center;;'>`+
                        `       <div style="background-repeat: no-repeat;background-size: contain;width:80%;height:50px;background-image: url('${props.imagesUrl}${carImage}');margin-bottom:20px "></div>`+
                        `       <div class='bookingDivDrag'>&nbsp;</div>`+
                        `   </div>`+
                        `   <div style='display:flex;flex-direction:row;;margin-bottom:20px;align-items: center;;'>`+
                        `       <div class='bookingStartingHourInfo'>&nbsp;</div>`+
                        `       <div style='padding-top:8px;padding-left:10px' >${pickupMoment}</div>`+
                        `   </div>`+
                        `   <div style='display:flex;flex-direction:row;;margin-bottom:20px;align-items: center ;;'>`+
                        `       <div class='bookingEndingHourInfo'>&nbsp;</div>`+
                        `       <div style='padding-top:8px;padding-left:10px' >${dropoffMoment}</div>`+
                        `   </div>`+
                        `   <div style='display:flex;flex-direction:row;;margin-bottom:20px;align-items: center ;;'>`+
                        `       <div class='bookingDriverInfo'>&nbsp;</div>`+
                        `       <div style='padding-top:8px;padding-left:10px' >${driverName}</div>`+
                        `   </div>`+
                        `</div>`


      // <div> of the booking at the last column (last day of week) , need to decrease 2 pixels, otherwise browser will hide the border
      if (weekday==6) bookDivWidth -= 2;

      // calculate the height of the post it (div) with the booking, considering the offset between the initial/final hours 
      // 60 pixels is the size of each hour <div>

      let bookDivHeight = (tableRowBookingBottom - tableRowBookingTop) * 62
      bookDivHeight -= parseInt(startingMinute, 10)
      bookDivHeight += parseInt(endingMinute, 10)

      /* cria div  */
      let $divBOOKING = $("<div />").css({
          position: "absolute",
          overflow:'hidden',
          padding: '5px',
          'border-radius': '5px',
          cursor: 'pointer',          
          backgroundColor: booking[10],                  // toogle color of the booking post it to highlight it
          border: `solid 2px ${booking[11]}`,
          height: bookDivHeight,
          width: bookDivWidth ,
      }).appendTo( $bookingsTable );

      $divBOOKING.attr('id', `bookTemporaryDiv${divCount}`);
      $divBOOKING.addClass('bookTemporaryDiv')    // bookTemporaryDiv is not a real CSS, it works only to identify it is a booking div

      let bookingId = booking[0]
      $divBOOKING.attr('booking_id', bookingId)  // unite the post its <div>'s that have to do with the same booking, for them to be dragged together with the mouse

      $divBOOKING.html( bookingHtml )

      // if click in the booking <div>, edit it
      $divBOOKING.on('click', function(e)   { 
        if (! draggingBookingDivYet)   editBookingRecord(e, $(this).attr('booking_id') )
      })
        
     
      // if user hover mouse over the booking <div> post it that have the same id, highlight them at the same time
      $divBOOKING.mouseenter(function()  {
        $( `[booking_id=${bookingId}]`).css('border', 'solid 2px black')
        $( `[booking_id=${bookingId}]`).css('background-color', '#ffffcc')
      });
      $divBOOKING.mouseleave(function()  {
        $( `[booking_id=${bookingId}]`).css('border', `solid 2px ${booking[11]}`)
        $( `[booking_id=${bookingId}]`).css('background-color', `${booking[10]}`  )
      })

      // memorize the IDs of the bookings to coming grouping of the bookings <div>'s  way below
      // example:  a boooking the overflows 2 or 3 days will be displyed in 2 or 3 <div>s and those divs will be draggable together

      if ( bookingsIDs.indexOf(bookingId) == -1 ) bookingsIDs.push( bookingId )

      let bookTopHourDivPosition = document.getElementById( $divBookingTop.attr('id') ).getBoundingClientRect()   // capture position of the <div> initial time of the booking
      let bookingsTablePosition = document.getElementById( 'bookingsTable' ).getBoundingClientRect()   // capture position of the container (parent) <div> of the bookings

      $divBOOKING.css("left", bookTopHourDivPosition.left - bookingsTablePosition.left + 2);   // position the booking <div> at the correct hour/day

      // if the initial hour is ot 'full hour' if it has minutes, conside those minutes when calculating position of the <div>
      // each hour <div> has 60 pixels, so each more minute= 1 more pixel

      let divTopPosition = parseInt(bookTopHourDivPosition.top, 10) - parseInt(bookingsTablePosition.top, 10)
      divTopPosition += parseInt(startingMinute , 10)    // minutes = pixels

      $divBOOKING.css("top", divTopPosition); 

      divCount++

    }

    // every <div> the refers the same booking will be dragged together
    // example:  a boooking that overflows 2 or 3 days, will be displayed in 3, 4 different <divs>
    setTimeout(() => {
        for (let ids=0; ids < bookingsIDs.length; ids++)  {
          $( `[booking_id=${bookingsIDs[ids]}]`).multiDraggable({ 
            group: $(`[booking_id=${bookingsIDs[ids]}]`),

            // impede disparo de 'click' na div reserva enqto estiver arrastando a div
            startNative: function (event,ui) {draggingBookingDivYet = true},
            stopNative : function (event,ui) { setTimeout(() => {draggingBookingDivYet = false}, 100); },
          });
        }
    }, 100);


  }
}


/****************************************************************************************************
 open booking edit form
****************************************************************************************************/
const editBookingRecord = (event, _id_) =>  {
  event.stopPropagation();  
  formHttpMethodApply.value = 'PATCH'
  bookingIdEdit.value = _id_

  showBookingForm.value = true
}

/****************************************************************************************************
 open booking form in blank to insert record
****************************************************************************************************/
const newBookingRecord = (event, _id_) =>  {
  // only allow adding booking if there's a car selected to which attach the booking
  let currentCard = $('.carCardSelected').attr('id')

  if (typeof currentCard=='undefined') {
    slidingMessage(props.expressions.need_car_selected, 2000)        
    return 
  }

  formHttpMethodApply.value = 'POST'
  bookingIdEdit.value = ''

  showBookingForm.value = true
}


/****************************************************************************************************
 close modal form
****************************************************************************************************/
const closeBookingForm = () =>  {
  showBookingForm.value=false
}






</script>


