
import 'spin.js/spin.css';
import {Spinner} from 'spin.js';

const prepareLoadingAnimation = () => {
    var opts = {
      lines: 12 // The number of lines to draw
    , length: 30 // The length of each line
    , width: 18 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.3 // Scales overall size of the spinner
    , corners: 3 // Corner roundness (0..1)
    , color: 'gray' // #rgb or #rrggbb or array of colors
    , opacity: 0.3 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: true // Whether to render a shadow
    , hwaccel: true // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    ,animation: 'spinner-line-fade-quick'
    }

    // para exibir/ocultar esta div, usar as funcoes: showLoadingGif()/hideLoadingGif()
    var divLoading = document.getElementById('divLoading');
    new Spinner(opts).spin(divLoading);
}

/************************************************************************************************************************************************************
check if a string is in JSON format
************************************************************************************************************************************************************/
const  isStringJSON = (string) => {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;

}



/************************************************************************************************************************************************************
display sliding message in red
************************************************************************************************************************************************************/
const slidingMessage = (html, time) => {

  let slidingDIV = $('#messagesSlidingDiv')

  slidingDIV.html('&nbsp;&nbsp;&nbsp;&nbsp;' + html);
  slidingDIV.show("slide", { direction: "left" }, 200);

  // browser wont allow play beep unless user already 'touched' something in the screen
  if (navigator.userActivation.hasBeenActive)     $('#alertBeep')[0].play()

  setTimeout(function () { slidingDIV.hide("slide", { direction: "right" }, 200); }, time);
}

/************************************************************************************************************************************************************
counter, useful to 'v-for' loops
************************************************************************************************************************************************************/
const counter = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
}

//********************************************************************************************************************************
// returns string in hour format, depending on the selected country/language 
// Brazil= hour= 5, string= 05:00,  hour= 22, string= 22:00
// USA= hour= 5, string= 05:00 am,  hour= 22, string= 10:00 pm
//*******************************************************************************************************************************
const hourFormat = (hour, currentCountry) => {
 
  let hourTMP = hour

  let am_pm = 'am'

  if (currentCountry == 'usa') {
    // convert example: 23:00 into 11:00 pm
    if (hourTMP > 12) {
      hourTMP -= 12
      am_pm = 'pm'
    }
  }
  // leading zeros
  hourTMP = hourTMP.toString();
  while (hourTMP.length < 2) hourTMP = "0" + hourTMP;

  if (currentCountry == 'usa')
    hourTMP += ':00 ' + am_pm
  else if (currentCountry == 'brazil')
    hourTMP += ':00'

  return (hourTMP)
}

//********************************************************************************************************************************
// prepares mouseover, over puppy icon,, bottom right corner
//*******************************************************************************************************************************

const preparePuppyIcon = () => {
  $('#divDoggy').mouseover(function (e) {
    $('#divDoggy_1').show(); $('#divDoggy_2').show(); $('#divDoggy_3').show();
    $('#divDoggy_1').animate({ bottom: '55px', right: '105px', zIndex: 3000 }, 200, function () {
    });

    $('#divDoggy_2').animate({ bottom: '75px', right: '125px', zIndex: 3000 }, 200);
    $('#divDoggy_3').animate({ bottom: '90px', right: '105px' }, 200, function () {
      $(this).css('z-index', 2101);
    });
  });

  // usuario tirou  mouse do icone cachorro 
  $('#divDoggy').mouseout(function (e) {
    $('#divDoggy_1').hide(); $('#divDoggy_2').hide(); $('#divDoggy_3').hide();
    $('#divDoggy_1').css('right', '80px'); $('#divDoggy_1').css('bottom', '1px');
    $('#divDoggy_2').css('right', '80px'); $('#divDoggy_2').css('bottom', '1px');
    $('#divDoggy_3').css('right', '80px'); $('#divDoggy_3').css('bottom', '-150px');
  });
}


/************************************************************************************************************************************************************
prepares date in string format, considering local UTC 
this is used when sending dates to recording in the back
***********************************************************************************************************************************************************/
const dateToIsoStringConsideringLocalUTC = (date) => {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}

/************************************************************************************************************************************************************
***********************************************************************************************************************************************************/

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        let hours =  d.getHours();
        let minutes =  d.getMinutes()

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);

    return ([year, month, day].join('-') + ' '+hours+':'+minutes)
}

/***********************************************************************************************************************
make a div (window) be draggable
***********************************************************************************************************************/
const makeWindowDraggable = (title_id, window_id) => {
  $(`#${window_id}`).draggable({ handle: `#${title_id}`, containment: '#backDrop' });
}

/***********************************************************************************************************************
the jquery tooltip wont go away when user clicks on a div or button with a tooltip attached to it, 
the code below solves this
***********************************************************************************************************************/
const forceHideToolTip = () => {
  $('div[class^="ui-tooltip"]').remove();
}

/*******************************************************************************/
const divStillVisible = (divId) => {
    // Current distance from the top of the page
    var windowScrollTopView = $(window).scrollTop();
    
    // Current distance from the top of the page, plus the height of the window
    var windowBottomView = windowScrollTopView + $(window).height();
 
    let $div = $(divId)
    
    // Element distance from top
    var elemTop = $div.offset().top;
            
    let elemBottom = elemTop + $div.height() + 80; 
      return ( elemBottom <= windowBottomView) && (elemTop >= windowScrollTopView ) ;
}


/************************************************************************************************************************************************************
scroll a horizontal div by scrolling the mouse wheel, which theorically should be only to vertical divs
************************************************************************************************************************************************************/
const toWheelCarsBrowser = e => {

  if (e.type == "wheel") {
    var getDelta = e.deltaY;
    let divId = 'carsBrowserContainer'

    if (getDelta>0) 
      $(`#${divId}`).scrollLeft( $(`#${divId}`).scrollLeft() + 100 )
    else 
      $(`#${divId}`).scrollLeft( $(`#${divId}`).scrollLeft() - 100 )
  };
}


/***********************************************************************************************************************************************************/
// scroll a div until finding a given child element
// for example, after writing a record, scrolls until show it in the datatable div
/***********************************************************************************************************************************************************/
export const scrollUntilElementVisible = (element_id) => {

  if (typeof $("#" + element_id).attr("id") == "undefined") return; // check it exists

  let container_div = $("#" + element_id).scrollParent(); // find its parent

  // elementnecessarily  has to have an ID
  let element = document.getElementById(element_id);

  element.scrollIntoView();

  let posY = container_div.scrollTop();
  container_div.scrollTop(posY - 15); // scrolls back a little because scrollIntoView exxagerate
}



//******************************************************************************
// load js files one after another, to avoid calling a function not loaded yet
//******************************************************************************
  function loadScripts(scripts) {
      var promises = [];
      scripts.forEach(function(script) {
          promises.push($.getScript(script));
      });
      return $.when.apply($, promises);
  }

//******************************************************************************
// improve the look of the title atribute (mouse hover an element)
// thanx jquery for this
// elements that have 'putPrettierTooltip' class will be affected
//******************************************************************************
function improveTooltipLook() {

  setTimeout( () => {
    // define tooltip of top buttons
    if (typeof $('.putPrettierTooltip').tooltip !== "undefined") {
      $('.putPrettierTooltip').tooltip({ 
        tooltipClass: 'prettierTitle_black',  
        show: false,  
        hide: false,  
        position: { my: "left top", at: "left top-40", collision: "flipfit" }
      })
    }

  }, 500)    


}



//********************************************************************************************************************************
//*******************************************************************************************************************************
export { prepareLoadingAnimation, isStringJSON, slidingMessage, counter, makeWindowDraggable, divStillVisible, 
      hourFormat, preparePuppyIcon, dateToIsoStringConsideringLocalUTC, formatDate, forceHideToolTip, loadScripts,
      toWheelCarsBrowser, improveTooltipLook };

