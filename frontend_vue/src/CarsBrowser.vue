
<template>

  <div class='carsBrowser' id='carsBrowser' > 

    <div :id='carCard0' class='carCard' :class='{carCardSelected: props.selectedCar==0}'  :key='0' 
        :style="{ 
          backgroundImage: `url(https://leanderdeveloper.store/hiring_machine/images/allcars.png)` ,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '130px 80px',
          backgroundPositionY: 'center'

        }" 
        @click="emit('setNewSelectedCar', 0)"   >
        <span class='text-2xl' >{{expressions.allcars}}</span>
    </div>


    <!-- car images hosted in AWS S3 -->
    <template v-if='cars.length!=0' >
        <div :id="'carCard' + car.id" class='carCard' :class='{carCardSelected: props.selectedCar==car.id}' v-for='car in cars' :key='car.id' 
            :style="{ 
              backgroundImage: `url(https://leanderdeveloper.store/hiring_machine/backend_php/car_images/car_${car.id}.png?${strToAvoidCache})` ,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '140px 90px',
              backgroundPositionY: 'center'

            }" 
            @click="emit('setNewSelectedCar', car.id)"   >
            <span>{{car.description}}</span>
            <span>{{car.plate}}</span>
        </div>
      </template>

    </div>

</template>


<script setup>
import { onMounted, ref  } from 'vue';
import { slidingMessage, toWheelCarsBrowser } from './assets/js/utils.js'
const props = defineProps( ['selectedCar', 'backendUrl', 'expressions'] )

const cars = ref([])
const strToAvoidCache = ref('')

// user clicks a car card
const emit = defineEmits(['setNewSelectedCar','hideLoading','showLoading']);


//*****************************************************************************
//*****************************************************************************
onMounted( () => {
  strToAvoidCache.value = (Math.random() + 1).toString(36).substring(7);
    
  fetchCars();
})
    

//*****************************************************************************
//*****************************************************************************

async function fetchCars()  {
    emit('showLoading')
    await fetch(`${props.backendUrl}/cars/active`)

    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {throw new Error(`HTTP error! ${response.status}` + text)})
      }
      return response.json()
    })
    .then((data) => {
      cars.value = data;        
      emit('hideLoading')

    })
    .catch((error) => {
      emit('hideLoading')
      slidingMessage('Error= '+error, 3000)        
    })  
}


</script>




<style scoped>
</style>
