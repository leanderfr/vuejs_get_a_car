
<template>

<!-- car form container  -->
<div  class="flex flex-col w-[95%] max-w-[1300px] overflow-hidden pt-8 "  id='carForm'>

  <div  class="flex flex-col w-full bg-white relative rounded-lg"  >

    <!-- title and close button  -->
    <div id='divWINDOW_TOP'>
      
      <div id='divWINDOW_TITLE'>

        <div v-if="formHttpMethodApply=='POST'">
          {{ expressions.new_car }}
        </div>
        <div v-if="formHttpMethodApply=='PATCH'">
          {{ expressions.edit_car }}
        </div>

      </div>

      <div class='flex flex-row '>
          <div id='divWINDOW_DRAG' class='mr-8'   >
            &nbsp;
          </div>

          <div class='divWINDOW_BUTTON mr-2'  aria-hidden="true" @click='userNeedsHelp' >
            &nbsp;&nbsp;[ ? ]&nbsp;&nbsp;
          </div>

          <div class='divWINDOW_BUTTON mr-6'  @click="emit('closeCarForm')"  aria-hidden="true" > 
            &nbsp;&nbsp;[ X ]&nbsp;&nbsp;
          </div>
      </div>
    
    </div>

    <!-- form fields below -->
    <div class="flex flex-col w-full h-auto  px-4 my-6" >

      <!-- description of the car and the plate -->
      <div class="flex flex-row w-full gap-[10px] border-b-2 pb-4">

        <div class="flex flex-col w-full ">
          <div class="flex flex-row w-full pb-2  gap-6">   
            <div class='w-1/2'>{{ expressions.description }}:</div>
            <div class='w-1/2'>{{ expressions.plate }}</div>
          </div>

          <div class="flex flex-row w-full pb-2 gap-6 ">  
            <div class='w-1/2'>
              <input type="text" autocomplete="off" sequence="1"   id="txtDescription" maxlength='50' minlength='5' class='text_formFieldValue w-full'  >  
            </div>
            <div class='w-1/2'>
              <input type="text" autocomplete="off" sequence="2"   id="txtPlate" maxlength='10' minlength='5' class='text_formFieldValue w-full'  >  
            </div>
          </div>

        </div>


      </div>

      <!-- car's picture -->
      <div class="flex flex-row w-full gap-[10px] h-[200px] items-end ">
          <img id='carPicture'  alt='' style='width:400px;height:200px;border-white' >
       </div>


    </div>

    <!-- botoes salvar/sair -->
    <div class="flex flex-row w-full justify-between px-6 border-t-[1px] border-t-gray-300 py-2">
      <button  id="btnCLOSE" class="btnCANCEL" @click="emit('closeCarForm')" >{{ expressions.button_cancel }}</button>

      <button  id="btnUPLOAD" class="btnUPLOAD" @click="fileCarImage.click()" >{{ expressions.upload_image }}</button>

      <button  id="btnSAVE" class="btnSAVE" @click="saveCar()" aria-hidden="true">{{ expressions.button_save }}</button>
    </div>

    <!-- upload button, hidden and will be 'clicked' programtically when user clicks the upload button -->
    <input type="file" accept="image/png" style="width: 0px; height: 0px; overflow: hidden;"  @change='carImageChanged' ref="fileCarImage" id="fileCarImage" >




  </div> 

</div> 

</template>


<script setup>
import { onMounted, ref  } from 'vue';
import { makeWindowDraggable, slidingMessage, dateToIsoStringConsideringLocalUTC, formatDate  } from '../assets/js/utils.js'
const emit = defineEmits( ['showLoading', 'hideLoading', 'closeCarForm','refreshDatatable'] );

import moment from 'moment';

const fileCarImage = ref(null)

const props = defineProps( ['expressions', 'backendUrl', 'currentCountry', 'formHttpMethodApply', 'currentId', 'imagesUrl'] )

onMounted( () => {
  getCarFormPopulatedAndReady()
})


/********************************************************************************************************************************************************
 user changes the car image, updates img src in the preview div
*******************************************************************************************************************************************************/
const carImageChanged = async () =>  { 
$('#carPicture').attr('src', window.URL.createObjectURL( document.getElementById('fileCarImage').files[0] )) 
}

/********************************************************************************************************************************************************
reset content of the <img> to avoid problem with the onchange event
*******************************************************************************************************************************************************/
const resetImage = async () =>  { 
$('#carPicture').attr('src', '')
}


//************************************************************************************************************************************************************
//************************************************************************************************************************************************************
const userNeedsHelp = () => {
  slidingMessage(props.expressions.user_needs_help, 3000)
}


/************************************************************************************************************************************************************
get data from the car record
************************************************************************************************************************************************************/

async function getCarFormPopulatedAndReady() { 

  // if car form was not called to record insertion, first fetch record data
  if ( props.formHttpMethodApply != 'POST')   {

    emit('showLoading')

    try {
        let _route_ = `${props.backendUrl}/car/${props.currentId}`

        await fetch(_route_, {method: 'GET'})

        .then( (response) => {

          if (!response.ok) {
            return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
          }
          return response.json();
        })

        .then( (car) => {
          emit('hideLoading')
          $('#txtDescription').val( car.description )
          $('#txtPlate').val( car.plate )

          $('#carPicture').attr('src', props.imagesUrl + car.car_image )

          putFocusInFirstInputText_AndOthersParticularitiesOfTheCarForm() 


        })


    } 
    catch(err) {
      emit('hideLoading')
      throw new Error(`Cars Prepare Err Fatal= ${err.message}`);
    }

  }

  // car form was called to add new record
  if ( props.formHttpMethodApply === 'POST')   {
    putFocusInFirstInputText_AndOthersParticularitiesOfTheCarForm()
  }

}


/************************************************************************************************************************************************************
put focus first field and prepare masks
************************************************************************************************************************************************************/
const putFocusInFirstInputText_AndOthersParticularitiesOfTheCarForm = () => { 

  setTimeout(() => {
    $('#txtDescription').focus()    
  }, 500);

  makeWindowDraggable('divWINDOW_TOP', 'carForm')
}





/********************************************************************************************************************************************************
 validate data from the form and try to save it
********************************************************************************************************************************************************/
async function saveCar()  {

  let toDo = props.formHttpMethodApply=='POST' ? 'insert' : 'update'
  let error = ''

  // minlength is invented, but needed to the IF below
  if ( $('#txtDescription').val().trim().length < parseInt($('#txtDescription').attr('minlength'), 10) )  
      error = props.expressions.missing_car_description + ' - Min: '+$('#txtDescription').attr('minlength')
  if ( $('#txtPlate').val().trim().length < parseInt($('#txtPlate').attr('minlength'), 10) )  
      error = props.expressions.missing_car_plate+ ' - Min: '+$('#txtPlate').attr('minlength')

  // check if user has chosen any image when adding record
  if (typeof $('#fileCarImage')[0].files[0]=='undefined' && toDo=='insert')   error = props.expressions.choose_an_image

  // show any error detected
  if (error!='') {
    slidingMessage(error, 3000)
    return;
  }

  var formData = new FormData(); 
  formData.append('description', $('#txtDescription').val())
  formData.append('plate', $('#txtPlate').val())
  // if user doenst choose image, the backend will bypass the update of the image
  if (typeof $('#fileCarImage')[0].files[0]!='undefined')   
    formData.append('image', $('#fileCarImage')[0].files[0]); 


  let route = ''
  if (props.formHttpMethodApply=='POST') 
    route += 'car'        
  if (props.formHttpMethodApply=='PATCH') 
    route += `car/${props.currentId}`   

  // formHttpMethodApply= POST, PATCH ou DELETE
  setTimeout(() => {
    emit('showLoading')    
  }, 10);
  
  // PHP doesnt work well with PATCH (laravel does), need to send all with POST here
  await fetch(`${props.backendUrl}/${route}`, {method: props.formHttpMethodApply, body: formData})

  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`HTTP error! ${response.status}|` + text+'|')
      })
    }
    return response.text()
  })
  .then((msg) => {
    slidingMessage(props.expressions.car_recorded, 1500)        
    emit('hideLoading')
    setTimeout(() => {
      emit('closeCarForm')  
      emit('refreshDatatable')  

    }, 1700);
    
  })
  .catch((error) => {
    emit('hideLoading')
    slidingMessage('Error= '+error, 3000)        
  })  

}



</script>
