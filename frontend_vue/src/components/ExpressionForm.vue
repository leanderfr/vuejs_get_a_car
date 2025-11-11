
<template>

<!-- form container  -->
<div  class="flex flex-col w-[95%] max-w-[1300px] overflow-hidden pt-8 "  id='expressionForm'>

  <div  class="flex flex-col w-full bg-white relative rounded-lg"  >

    <!-- title and close button  -->
    <div id='divWINDOW_TOP'>
      
      <div id='divWINDOW_TITLE'>

        <div v-if="formHttpMethodApply=='POST'">
          {{ expressions.new_expression }}
        </div>
        <div v-if="formHttpMethodApply=='PATCH'">
          {{ expressions.edit_expression }}
        </div>

      </div>

      <div class='flex flex-row '>
          <div id='divWINDOW_DRAG' class='mr-8'   >
            &nbsp;
          </div>

          <div class='divWINDOW_BUTTON mr-2'  aria-hidden="true" @click='userNeedsHelp' >
            &nbsp;&nbsp;[ ? ]&nbsp;&nbsp;
          </div>

          <div class='divWINDOW_BUTTON mr-6'  @click="emit('closeExpressionForm')"  aria-hidden="true" > 
            &nbsp;&nbsp;[ X ]&nbsp;&nbsp;
          </div>
      </div>
    
    </div>

    <!-- form fields below -->
    <div class="flex flex-col w-full h-auto  px-4 my-6" >

      <!-- the item itself, and its english/portuguese translations -->
      <div class="flex flex-row w-full gap-[10px] border-b-2 pb-4">

        <div class="flex flex-col w-full ">
          <div class="flex flex-row w-full pb-2  gap-6">   
            <div class='w-1/2'>{{ expressions.field_item }}:</div>
            <div class='w-1/2'>{{ expressions.field_english }}:</div>
            <div class='w-1/2'>{{ expressions.field_portuguese }}</div>
          </div>

          <div class="flex flex-row w-full pb-2 gap-6 ">  
            <div class='w-1/3'>
              <input type="text" autocomplete="off" sequence="1"   id="txtItem" maxlength='30' minlength='3' class='text_formFieldValue w-full'  >  
            </div>
            <div class='w-1/3'>
              <input type="text" autocomplete="off" sequence="2"   id="txtEnglish" maxlength='200' minlength='3' class='text_formFieldValue w-full'  >  
            </div>
            <div class='w-1/3'>
              <input type="text" autocomplete="off" sequence="3"   id="txtPortuguese" maxlength='200' minlength='3' class='text_formFieldValue w-full'  >  
            </div>

          </div>

        </div>


      </div>


    </div>

    <!-- botoes salvar/sair -->
    <div class="flex flex-row w-full justify-between px-6 border-t-[1px] border-t-gray-300 py-2">
      <button  id="btnCLOSE" class="btnCANCEL" @click="emit('closeExpressionForm')" >{{ expressions.button_cancel }}</button>

      <button  id="btnSAVE" class="btnSAVE" @click="saveExpression()" aria-hidden="true">{{ expressions.button_save }}</button>
    </div>

  </div> 

</div> 

</template>


<script setup>
import { onMounted, ref  } from 'vue';
import { makeWindowDraggable, slidingMessage   } from '../assets/js/utils.js'
const emit = defineEmits( ['showLoading', 'hideLoading', 'closeExpressionForm','refreshDatatable'] );

const props = defineProps( ['expressions', 'backendUrl', 'currentCountry', 'formHttpMethodApply', 'currentId'] )

onMounted( () => {
  getExpressionFormPopulatedAndReady()
})

//************************************************************************************************************************************************************
//************************************************************************************************************************************************************
const userNeedsHelp = () => {
  slidingMessage(props.expressions.user_needs_help, 3000)
}


/************************************************************************************************************************************************************
get data from the expression record
************************************************************************************************************************************************************/
async function getExpressionFormPopulatedAndReady() { 

  // if expression form was not called to record insertion, first fetch record data
  if ( props.formHttpMethodApply != 'POST')   {

    emit('showLoading')

    try {
        let _route_ = `${props.backendUrl}/expression/${props.currentId}`

        await fetch(_route_, {method: 'GET'})

        .then( (response) => {

          if (!response.ok) {
            return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
          }
          return response.json();
        })

        .then( (expression) => {
          emit('hideLoading')
          $('#txtItem').val( expression.item )
          $('#txtEnglish').val( expression.english )
          $('#txtPortuguese').val( expression.portuguese )

          putFocusInFirstInputText_AndOthersParticularitiesOfTheExpressionForm() 


        })


    } 
    catch(err) {
      emit('hideLoading')
      throw new Error(`Expression Prepare Err Fatal= ${err.message}`);
    }

  }

  // expression form was called to add new record
  if ( props.formHttpMethodApply === 'POST')   {
    putFocusInFirstInputText_AndOthersParticularitiesOfTheExpressionForm()
  }

}


/************************************************************************************************************************************************************
put focus first field and prepare masks
************************************************************************************************************************************************************/
const putFocusInFirstInputText_AndOthersParticularitiesOfTheExpressionForm = () => { 

  setTimeout(() => {
    $('#txtItem').focus()    
  }, 500);

  makeWindowDraggable('divWINDOW_TOP', 'expressionForm')
}





/********************************************************************************************************************************************************
 validate data from the form and try to save it
********************************************************************************************************************************************************/
async function saveExpression()  {

  let error = ''

  if ( $('#txtItem').val().trim().length < parseInt($('#txtItem').attr('minlength'), 10)  )  
      error = props.expressions.missing_item + ' - Min '+$('#txtItem').attr('minlength')
  if ( $('#txtEnglish').val().trim().length < parseInt($('#txtEnglish').attr('minlength'), 10) )  
      error = props.expressions.missing_english + ' - Min '+$('#txtEnglish').attr('minlength')
  if ( $('#txtPortuguese').val().trim().length < parseInt($('#txtPortuguese').attr('minlength'), 10) )  
      error = props.expressions.missing_portuguese + ' - Min '+$('#txtPortuguese').attr('minlength')


  // show any error detected
  if (error!='') {
    slidingMessage(error, 3000)
    return;
  }

  var formData = new FormData(); 
  formData.append('item', $('#txtItem').val())
  formData.append('english', $('#txtEnglish').val())
  formData.append('portuguese', $('#txtPortuguese').val())

  let route = ''
  if (props.formHttpMethodApply=='POST') 
    route += 'expression'        
  if (props.formHttpMethodApply=='PATCH') 
    route += `expression/${props.currentId}`   

  // formHttpMethodApply= POST, PATCH ou DELETE
  setTimeout(() => {
    emit('showLoading')    
  }, 10);
  
  // PHP doesnt work well with PATCH (laravel does), need to send all with POST here
  await fetch(`${props.backendUrl}/${route}`, {method: props.formHttpMethodApply, body: formData})

  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
    }
    return response.text()
  })
  .then((msg) => {
    slidingMessage(props.expressions.expression_recorded, 1500)        
    emit('hideLoading')
    setTimeout(() => {
      emit('closeExpressionForm')  
      emit('refreshDatatable')  

    }, 1700);
    
  })
  .catch((error) => {
    emit('hideLoading')
    slidingMessage('Error= '+error, 3000)        
  })  

}



</script>
