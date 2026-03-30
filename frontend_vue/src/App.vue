
<template>

  <div>  <!-- fragment -->

    <div id='appBody'>  

      <!-- 
      ****************************************************************************************************************
      1st row - header 
      ****************************************************************************************************************
      -->
      <div class='headerBar'>

          <div id='headerLogo' ></div>

          <div class='headerText' >
              <div>{{ expressions.app_header_title }}</div>
          </div>

          <!-- language/country selector  -->
          <div class="headerRight">    

            <div :class="! isUSASelected ? 'flagClicked' : 'flagUnclicked' "   id='flagBRAZIL'  @click="isUSASelected = false"  >         
              <img src="https://leanderdev.com.br/vuejs_get_a_car/images/brazil_flag.svg" alt='' />
            </div>

            <label for="chkLanguageSelector" class="switch_language"  >
              <input id="chkLanguageSelector" type="checkbox"  v-model="isUSASelected"    />
              <span class="slider_language round"></span>
            </label>

            <div :class="isUSASelected ? 'flagClicked' : 'flagUnclicked' "   id='flagUSA'  @click="isUSASelected = true"  >         
              <img src="https://leanderdev.com.br/vuejs_get_a_car/images/usa_flag.svg" alt='' />
            </div>

          </div>

      </div>

      <div id='mainMenu'>

        <div class='itemMenuExpressions' :class="currentMenuItem=='expressions' ? 'itemMenuClicked' : 'itemMenu'" @click="currentMenuItem='expressions';setDatatableToDisplay('expression')"  aria-hidden="true">
          {{ expressions.expressions }} 
        </div>

        <div class='itemMenuCars' :class="currentMenuItem=='cars' ? 'itemMenuClicked' : 'itemMenu'" @click="currentMenuItem='cars';setDatatableToDisplay('car')"  aria-hidden="true">
          {{ expressions.cars }}
        </div>

        <div class='itemMenuSchedule' :class="currentMenuItem=='schedule' ? 'itemMenuClicked' : 'itemMenu'" @click="currentMenuItem='schedule';displaySchedule()"  aria-hidden="true">
          {{ expressions.schedule }}
        </div>

        <div class='itemMenuAccessesEnabled' :class="currentMenuItem=='accesses' ? 'itemMenuClicked' : 'itemMenu'" @click="currentMenuItem='accesses';"  aria-hidden="true">
          {{ expressions.app_accesses }}
        </div>


      </div>


      <!-- 
      ****************************************************************************************************************
      2nd row - schedule or datatable (left) and cars browser (right)
      ****************************************************************************************************************
      -->

      <div id='mainContainer'>


          <!-- display schedule/cars browser only if theres at least 1 car, 1 expression and the user asked to see it (toDisplaySchedule) -->
          <!-- Schedule needs JS files ready  (neededJsLoaded) -->
          <template v-if="toDisplaySchedule && neededJsLoaded && expressions.length!=0"  > 

              <!-- 
              ****************************************************************************************************************
              left corner - schedule or datatable, it depends which one the user has asked to see
              ****************************************************************************************************************
              -->

              <div id='leftScheduleContainer'>

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

              <!-- 
              ****************************************************************************************************************
              right corner - cars browser, always visible
              ****************************************************************************************************************
              -->


              <!-- right corner, cars browser -->
              <div id='rightCarsBrowserContainer' class='mr-3 border-r-2' >

                <CarsBrowser 
                  :key='toRefreshCarsBrowser' 
                  :selectedCar='selectedCar' 
                  :backendUrl='backendUrl'    
                  :expressions='expressions' 
                  @showLoading="isLoading=true" 
                  @hideLoading="isLoading=false"
                  @setNewSelectedCar='setNewSelectedCar'            />  


              </div>
        </template> 

        <!-- display datatable if user clicked in some type of record to list (cars or expressions)  -->
        <template v-if='toDisplayDatatable'  >

          <div class='w-full'>
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
        </template>





      </div>

      <!-- 
      ****************************************************************************************************************
      3nd row - info about the app
      ****************************************************************************************************************
      -->

 
      <div class='flex flex-row text-[16px] font-bold h-[65px] align-middle bg-gray-200 absolute bottom-0 w-full py-[2px] text-gray-500 justify-between'> 
        <div class='flex flex-row items-center gap-3 pl-4  flex-1' >
          Frontend:
          <img src="./assets/images/html5.png" class='h-[45px]' alt='' />
          <img src="./assets/images/css3.png" class='h-[45px]' alt='' />
          <img src="./assets/images/jscript.png" class='h-[45px]' alt='' />
          <img src="./assets/images/tailwind.png" class='h-[45px]' alt='' />
          <img src="./assets/images/vuejs.png" class='h-[45px]' alt='' />
          <img src="./assets/images/jquery.png" class='h-[45px]' alt='' />
        </div>
        <div class='flex flex-row items-center gap-3 pl-7 flex-1 justify-center'  >
          Current Backend:
          <div :class="currentBackend=='php' ? 'optionBackendClicked' : 'optionBackend'" @click="currentBackend='php';"  aria-hidden="true">
            <img src="./assets/images/php_.png" class='h-[60px]' alt='' />
          </div>
          <div :class="currentBackend=='nodejs' ? 'optionBackendClicked' : 'optionBackend'" @click="currentBackend='nodejs';"  aria-hidden="true">
            <img src="https://leanderdev.com.br/vuejs_get_a_car/images/_nodejs.png" class='h-[45px]' alt='' />
          </div>
        </div>
        <div class='flex-1 flex'>
            <div class=' flex flex-row items-center justify-center   hover:border-blue-900 hover:border-4 border-4 border-transparent hover:cursor-pointer rounded-lg w-[70%]'
              @click="openNewTab('https://github.com/leanderfr/hm_vue_php_test')"  >
              {{ expressions.source_code }}
              <img src="./assets/images/github.png" alt='' class="pl-3"  />
            </div>
        </div>
  <!--
        <div class='flex flex-row w-20' ></div>
        <div class='flex flex-row items-center justify-center gap-3  hover:border-blue-900 hover:border-4 border-4 border-transparent hover:cursor-pointer w-[250px] rounded-lg' 
          @click="openNewTab('https://www.youtube.com/watch?v=3UCXnT7TfMs')"  >  
          {{ expressions.about_app }}
          <img src="./assets/images/youtube.png" alt='' class="pl-3"  />
        </div>
  -->


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
      <source src="https://leanderdev.com.br/vuejs_get_a_car/sounds/error_beep.mp3" type="audio/mpeg">    
    </audio>

    <!-- puppy icon bottom right corner  -->
    <div class='_doggy'  id='divDoggy'></div>
    <div class='_doggy_1' id='divDoggy_1'></div>
    <div class='_doggy_2' id='divDoggy_2'></div>
    <div v-if='isUSASelected' class='_doggy_3_english' id='divDoggy_3'></div>
    <div v-if='! isUSASelected' class='_doggy_3_portuguese' id='divDoggy_3'></div>



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

  //const emit = defineEmits( ['setDatatableToDisplay', 'toDisplaySchedule'] );


  import { prepareLoadingAnimation, toWheelCarsBrowser, slidingMessage , preparePuppyIcon, loadScripts } from './assets/js/utils.js'


  const neededJsLoaded = ref(false)   

  const toRefreshCarsBrowser = ref(0)  
  const toRefreshDatatable = ref(0)  
  const toRefreshSchedule = ref(0)  

  const isUSASelected = ref(false)
  const expressions = ref([])  
  const isLoading = ref(true)
  const error = ref(null)

  const currentMenuItem = ref('schedule')   
  const currentBackend = ref('php')   

  // it changes depending if the app is running as a container (AWS EC2) or locally
  //const backendUrl = ref('http://ec2-54-233-183-5.sa-east-1.compute.amazonaws.com:8073')  
  const backendUrl = ref('https://leanderdev.com.br/vuejs_get_a_car/backend_php')  

  //const imagesUrl = ref('https://devs-app.s3.sa-east-1.amazonaws.com/hiring_machine/')  
  const imagesUrl = ref('https://leanderdev.com.br/vuejs_get_a_car/backend_php/car_images/')  

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
    displaySchedule()
  }

  //***************************************************************************
  //  user clicked in a given table in the schedule top bar
  //***************************************************************************
  const setDatatableToDisplay = (datatable) => {
    toDisplaySchedule.value = false;
    toDisplayDatatable.value = true;

    selectedCar.value = -1  // removes highlight border from currently selected car

    toRefreshDatatable.value++

    currentViewedDatatable.value = datatable
  }

  //***************************************************************************
  //  user clicked on the schedule button inside the datatalbe component
  //***************************************************************************
  const displaySchedule = () => {
    toDisplaySchedule.value = true
    toDisplayDatatable.value = false

    //selectedCar.value = 0  // puts highlight border in the 'all cars' icon
  }

  //***************************************************************************
  //  opens an url in a new tab
  //***************************************************************************
  const openNewTab = (url) => { 
    window.open(url, '_blank');
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

    await fetch(`${backendUrl.value}/expression/list/reference/${country}/active`)

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
      slidingMessage(error, 3000)        
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
