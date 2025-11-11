
<template>

  <div>  <!-- fragment -->

    <div class='appBody'>  

      <div class='headerBar'>

        <div id='headerLogo' ></div>

        <div class='headerText' >
            <div>{{ expressions.app_header_title }}</div>
        </div>

        <!-- language/country selector  -->
        <div class="headerRight">    

          <div :class="! isUSASelected ? 'flagClicked' : 'flagUnclicked' "   id='flagBRAZIL'  @click="isUSASelected = false"  >         
            <img src="./assets/images/brazil_flag.svg" alt='' />
          </div>

          <label for="chkLanguageSelector" class="switch_language"  >
            <input id="chkLanguageSelector" type="checkbox"  v-model="isUSASelected"    />
            <span class="slider_language round"></span>
          </label>

          <div :class="isUSASelected ? 'flagClicked' : 'flagUnclicked' "   id='flagUSA'  @click="isUSASelected = true"  >         
            <img src="./assets/images/usa_flag.svg" alt='' />
          </div>

        </div>

      </div>

      <!-- horizontal cars browser -->
      <div class='carsBrowserContainer' id='carsBrowserContainer' style='scrollbar-width: thin;' @wheel='toWheelCarsBrowser'>
        <CarsBrowser 
          :key='toRefreshCarsBrowser' 
          :selectedCar='selectedCar' 
          :backendUrl='backendUrl'    
          @showLoading="isLoading=true" 
          @hideLoading="isLoading=false"
          @setNewSelectedCar='setNewSelectedCar'            /> 
      </div>

      <!-- mainContainer is the place where dynamic content is viewed/replaced/etc  -->

      <!-- display schedule only if theres at least 1 car and 1 expression  -->
      <!-- Schedule needs JS files ready  (neededJsLoaded) -->
      <div v-if="toDisplaySchedule && neededJsLoaded && expressions.length!=0" id='mainContainer'  >
        <!-- if the user clicks in the 'NO FILTER' icon in the schedule screeen, setNewSelectedCar will be 0 -->
        <Schedule 
            :key='toRefreshSchedule' 
            :expressions='expressions' 
            :currentCountry="isUSASelected ? 'usa' : 'brazil'" 
            :backendUrl='backendUrl'    
            :imagesUrl = 'imagesUrl'
            :selectedCar='selectedCar'
            @setNewSelectedCar='setNewSelectedCar'
            @setDatatableToDisplay='setDatatableToDisplay'
            @showLoading="isLoading=true" 
            @hideLoading="isLoading=false" />
      </div>

      <!-- display datatable if user clicked in some type of record to list (cars or expressions)  -->
      <div v-if='toDisplayDatatable' id='mainContainer'  >

        <Datatable  
            :key='toRefreshDatatable'
            :currentViewedDatatable = currentViewedDatatable
            :setDatatableToDisplay='setDatatableToDisplay' 
            :expressions='expressions' 
            :currentCountry="isUSASelected ? 'usa' : 'brazil'" 
            :backendUrl='backendUrl'    
            @showLoading="isLoading=true" 
            @hideLoading="isLoading=false"     
            @toDisplaySchedule='displaySchedule'   
            @toRefreshCarsBrowser="toRefreshCarsBrowser++"
            @toRefreshExpressions="fetchExpressions()" 
            @setDatatableToDisplay='setDatatableToDisplay'
            :imagesUrl = 'imagesUrl' />
      </div>


      <!-- footer toolbar   -->
      <div v-if="expressions.length!=0" class='bottomToolbar'  >     
      </div>


    </div>


    <!-- waiting backend response animation, thanx God Vue has 'v-show', React doesnt and the animation has to be (re)prepared all the time  -->
    <div v-show="isLoading" class='backdropTransparent'  >
      <div id='divLoading' >&nbsp;</div>
    </div>

    <!-- show sliding error messages -->
    <div id="messagesSlidingDiv" >
      &nbsp;
    </div>

    <audio id="alertBeep" >
      <source src="./assets/sounds/error_beep.mp3" type="audio/mpeg">    
    </audio>

    <!-- puppy icon bottom right corner  -->
    <div class='_doggy'  id='divDoggy'></div>
    <div class='_doggy_1' id='divDoggy_1'></div>
    <div class='_doggy_2' id='divDoggy_2'></div>
    <div v-if='isUSASelected' class='_doggy_3_english' id='divDoggy_3'></div>
    <div v-if='! isUSASelected' class='_doggy_3_portuguese' id='divDoggy_3'></div>


    <div class='absolute bottom-0  flex flex-row left-4 text-[20px] font-bold gap-7 h-[50px]'>
      <div class='flex flex-row items-center gap-3' >
        Frontend:
        <img src="./assets/images/vue.svg" alt='' />
      </div>
      <div class='flex flex-row items-center gap-3' >
        Backend:
        <img src="./assets/images/php.svg" alt='' />
      </div>

    </div>

  </div>


</template>


<!-- composition API , way cleaner then options API -->
<script setup>
  import { ref, onMounted, watch, onBeforeMount  } from 'vue';
  import CarsBrowser from './CarsBrowser.vue';
  import Schedule from './Schedule.vue';
  import Datatable from './components/Datatable.vue';

  // some nice effects using jquery
  import 'jquery-ui-bundle';
  import 'jquery-ui-bundle/jquery-ui.min.css';

  import { toWheelCarsBrowser, prepareLoadingAnimation, slidingMessage , preparePuppyIcon, loadScripts } from './assets/js/utils.js'


  const neededJsLoaded = ref(false)   

  const toRefreshCarsBrowser = ref(0)  
  const toRefreshDatatable = ref(0)  
  const toRefreshSchedule = ref(0)  

  const isUSASelected = ref(true)
  const expressions = ref([])  
  const isLoading = ref(true)
  const error = ref(null)

  // it changes depending if the app is running as a container (AWS EC2) or locally
  //const backendUrl = ref('http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:8073')  
  const backendUrl = ref('http://leanderdeveloper.store/hiring_machine/backend_php')  

  //const imagesUrl = ref('https://devs-app.s3.sa-east-1.amazonaws.com/hiring_machine/')  
  const imagesUrl = ref('http://leanderdeveloper.store/hiring_machine/backend_php/car_images/')  

  // currently selected car (starts with 0= show schedule of all cars)
  const selectedCar = ref(0)

  // which datatable should be displayed (cars, expressions, etc)
  const currentViewedDatatable = ref('')

  // if the schedule should be displayed
  const toDisplaySchedule = ref(true)

  // if some datatable should be displayed
  const toDisplayDatatable = ref(false)





  //***************************************************************************
  // user changes current selected car in the CarsBrowser component
  //***************************************************************************
  const setNewSelectedCar = (carId) => {
    selectedCar.value = carId
  }

  //***************************************************************************
  //  user clicked in a given table in the schedule top bar
  //***************************************************************************
  const setDatatableToDisplay = (datatable) => {
    toDisplaySchedule.value = false;
    toDisplayDatatable.value = true;

    toRefreshDatatable.value++

    currentViewedDatatable.value = datatable
  }

  //***************************************************************************
  //  user clicked on the schedule button inside the datatalbe component
  //***************************************************************************
  const displaySchedule = () => {
    toDisplaySchedule.value = true
    toDisplayDatatable.value = false
  }


  //******************************************************************************************
  // load crucial js before anything - DEPRECATED , JS will be loaded in index.html
  //******************************************************************************************
  onBeforeMount( () => {

    var scriptsToLoad = [
    ]


    loadScripts(scriptsToLoad).done(function() {
      neededJsLoaded.value=true        
    });
  })


  //***************************************************************************
  //***************************************************************************
  onMounted( () => {
      // handler to keyboard
      window.onkeydown = (event) => {
        onKeyDown(event)
      };


      // for now, when user resizes window, I have no solution but but refreshing the whole window
      // if I had time I would make it responsive using sm md ld breakpoint modifiers of tailwind
      window.onresize = (event) => {
        setTimeout(() => {
          window.location.reload();  
        }, 500);
      }
 
      preparePuppyIcon()
      prepareLoadingAnimation()

      isLoading.value = true

      Promise.all( [fetchExpressions()] ).then(() => {
          // here I wont close the loading animation, one of the components will do it - schedule or datatable, whichever finished loading first
          //  isLoading.value = false        
      })
  })

  //***************************************************************************
  // if user changes current language, (re) fetch expressions (port/english)
  // and force reload of impacted components 
  //*************************************************************************** 
  watch([isUSASelected], () => { 
      isLoading.value = true;

      Promise.all( [fetchExpressions()] ).then(() => {
        isLoading.value = false
        // components that use expressions directly
        toRefreshDatatable.value++
        toRefreshSchedule.value++
      })        
    },
    { immediate: false }
  )


  //***************************************************************************
  // if user changes current car in cars browser, force refresh of 
  // schedule based on the new car id
  //*************************************************************************** 
  watch([selectedCar], () => {
    toRefreshSchedule.value++
    },
    { immediate: false }
  )



  //***************************************************************************
  //*************************************************************************** 
  async function fetchExpressions()  {
    let country = isUSASelected.value ? 'usa' : 'brazil';

    await fetch(`${backendUrl.value}/expressions/reference/${country}/active`)

    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
      }
      return response.json()
    })
    .then((data) => {
      expressions.value = data;        
    })
    .catch((error) => {
      isLoading.value = false;
      slidingMessage('Error= '+error, 3000)        
    })  
  }



/************************************************************************************************************************************************************
 handle key pressed throughout the entire application
************************************************************************************************************************************************************/

const onKeyDown = (e) =>  {

  // if user presses Enter or arrow down/up, backs or forwards the focus to the next/previous field
  if ( (e.which == 13 || e.which == 38 || e.which == 40)  && $('.text_formFieldValue').is(':focus') )   { 
        // I had to invent the 'sequence' property, because VITE is bugging about tabIndex

        let tab =  $(':focus').attr("sequence");
        if (e.which==13 || e.which == 40)  tab++;
        else if (e.which==38)  tab--;

        e.preventDefault()

        // put the focus in the next/previous field based on the pre determined 'sequence' property
        $("[sequence='"+tab+"']").focus();          
  }

  // if user presses Enter when the  search box of Datatable.vue is focused and fullfilled, triggers the search
  if (e.which == 13 && $('#txtTableSearchText').is(':focus') )   { 
    if (  $.trim($('#txtTableSearchText').val()).length<3 ) 
      slidingMessage(expressions.value.searchbox_minimum, 2000)        
    else 
      $('#triggerSearchBox').click()
  } 
    
  
  // if user presses F2 or Esc, being any form edit screen opened
  if (e.which == 27 || e.which == 113)   { 
        let editionForm = typeof $('#bookingForm').attr("id")!='undefined' || 
                          typeof $('#carForm').attr("id")!='undefined' || 
                          typeof $('#expressionForm').attr("id")!='undefined'

        // triggers close button
        if (editionForm)  {
          if (e.which == 27)   $('#btnCLOSE').trigger('click')

          // 'F2= save'
          if (e.which == 113)   $('#btnSAVE').trigger('click')   // f2 was pressed
        }
  }
}


</script>


<style scoped>
</style>
