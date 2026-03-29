
  <!-- car images hosted in AWS S3 -->
  <template v-if='cars.length!=0' >



  <div class=' flex flex-col ' style='width: 100vw;'>

<!--


'ALL CARS' icon deprecated, to show all car's schedule, there is a button NO FILTER at the top of the schedule's componnt 

    <div :id='carCard0' class='carCard' :class='{carCardSelected: props.selectedCar==0}'  :key='0' 
        :style="{ 
          backgroundImage: `url(https://leanderdev.com.br/vuejs_get_a_car/images/allcars.png)` ,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '130px 80px',
          backgroundPositionY: 'center'

        }" 
        @click="emit('setNewSelectedCar', 0)"   >
        <span class='text-2xl' >{{expressions.allcars}}</span>
    </div>

-->


        <div :id="'carCard' + car.id" class='carCard' :class='{carCardSelected: props.selectedCar==car.id}' v-for='car in cars' :key='car.id' 
            :style="{ 
              backgroundImage: `url(https://leanderdev.com.br/vuejs_get_a_car/backend_php/car_images/car_${car.id}.png?${strToAvoidCache})` ,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '180px 90px',
              backgroundPosition: 'center center'

            }" 
            @click="emit('setNewSelectedCar', car.id)"   >
<!--

            <span>{{car.description}}</span>
            <span>{{car.plate}}</span>
-->
        </div>

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
    await fetch(`${props.backendUrl}/car/list/active`)

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
      slidingMessage(error, 3000)        
    })  
}


</script>




<style scoped>
</style>
