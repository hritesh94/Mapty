'use strict';
//Note -a small note that if any script.js like suppose this leaflet hosted script is written before this script.js then the global variable of leaflet will also be accessible to script.js becoz its global and included before the scriptjs and if it would have included after we would not be able to access it

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// //making map global
// let map, mapEvent;

//Geolocation api👇
// if (navigator.geolocation)
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       //this function is the success callback that means it happens when its successful
//       const { latitude, longitude } = position.coords;
//       console.log(position);
//       console.log(latitude, longitude);
//       console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

//       const coords = [latitude, longitude];

//       //this 👇 whole code is copied from the overview page  of leaflet website
//       //                         this👇 coords so "L" asks for an array of coordinates which we have specified
//     map = L.map('map').setView(coords, 13); //"L" means the namespace of Leaflet which contains many methods made by Leaflet
//       /// here👆 this string should be the 'id' used in html where the map should be displayed

//       //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {//these are for styles of map and it was default and also we can change with some googling
//       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       //   console.log(map);
//       //this👇 whole code from documentation which helps us to add marker on map and display a message
//       //   L.marker(coords)
//       //     .addTo(map)
//       //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//       //     .openPopup();

//           //handling clicks on map
//       //this👇 map is an object which contains an on() method which is actually a special type of eventlistener created by leaflet (as old addeventListener would not work here)
//           map.on('click', function (mapEventParam) {

//               //passing mapEventParam genrated from click on map to global var mapEvent👇
//               mapEvent = mapEventParam;

//               //whenver a click happens on map the form starts showing
//               form.classList.remove('hidden');
//               //also after showing form cursor blinks on inputDistance(focus)
//               inputDistance.focus();

//             //this whole code is moved into form submit so that the click on the map fires the form
//         // console.log(mapEvent);
//         // //we got this from console logging mapEvent👇
//         // const { lat, lng } = mapEvent.latlng;
//         // L.marker([lat, lng])
//         //   .addTo(map)
//         //   .bindPopup(
//         //     L.popup({
//         //       maxWidth: 250,
//         //       minWidth: 100,
//         //       autoClose: false,
//         //       closeOnClick: false,
//         //       className: 'running-popup',
//         //     })
//         //   ) //we got this from documentation
//         //   .setPopupContent('Workout')
//         //   .openPopup();
//       });
//     },
//     function () {
//       //this function is the error callback that means it happens when there is error

//       alert('Could not get your position');
//     }
//   );

// //submitting form
// form.addEventListener('submit', function (e) {
//   e.preventDefault();

//   //Clear Input fields;
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       '';

//   //Display marker
//   console.log(mapEvent);
//   //we got this from console logging mapEvent👇
//   const { lat, lng } = mapEvent.latlng;
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: 'running-popup',
//       })
//     ) //we got this from documentation
//     .setPopupContent('Workout')
//     .openPopup();
// });

// //👇now changing input type from running to cycling and vice versa
// inputType.addEventListener('change', function (e) {
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
// });

//------------------------------As the above code was written before the making of software architecture and so we will now make 👇 here using the architecture so it looks less messy-----------------------------------------------------

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10); //creating id using date but we could have used some library also creating ids on our own is not good so we used date here
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; //in kms
    this.duration = duration; // in mins
  }
  _setDescription() {
    //prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      //we can use 'type' which is defined in child class coz it will access throught prototype chain
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //mins/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

////////////////////////////////////////////
//APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;
  constructor() {
    // well we want the page to immediately get the position so to immediately trigger the api and thats why we are writing this in constructor coz it gets immediately called
    //to trigger geolocation api👇
    this._getPosition();

    //Get data from local storage
    this._getLocalStorage();


    //EVENT HANDLERS
    //submitting form
    form.addEventListener(
      'submit',
      this._newWorkout.bind(this) //here the "this" keyword will point to form so to make it point to App we need to .bind() it again
    );

    //👇now changing input type from running to cycling and vice versa
    inputType.addEventListener(
      'change',
      this._toggleElevationField //here it does not use "this" keyword so we dont need to bind it
    );

    //Move the camera to that area of map for where the workout was marked 
    containerWorkouts.addEventListener('click', this._movetoPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // well actually here the getCurrentPosition doesnt call this funciton as a method or it just calls it as a regular function and thats why the "this" keyword here is undefined and so to bind it we are using .bind() so after bind it will return a new function which will then be called by the getCurrent one
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    //Recieve Positions send by param of navigator.geolocation inside _getPosition()
    const { latitude, longitude } = position.coords;
   

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //handling clicks on map
    this.#map.on(
      'click',
      this._showForm.bind(this) //as its "this" keyword points to map so we want to point it to App object
    );

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);// so if you see inside _getLocalStorage that we have commented this method as it would not have worked but it would work here perfectly coz by then the map has been loaded
    })
  }

  _showForm(mapEventParam) {
    //passing mapEventParam genrated from click on map to global var mapEvent👇
    this.#mapEvent = mapEventParam;

    //whenver a click happens on map the form starts showing
    form.classList.remove('hidden');
    //also after showing form cursor blinks on inputDistance(focus)
    inputDistance.focus();
  }

  _hideForm() {
    //Clear Input fields;or Empty Inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    //trying to hide form smoothing
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    //these two here 👇 are helper function which checks if the inputs are positive and numbers or not and it also helps in refactoring
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value; //+ means converting to number
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //If workout running,create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        //refactored ver👇 of above logic👆
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to positive numbers!'); //<=GUARD CLAUSE =>So again, what a guard clause means is that we will basically check for the opposite of what we are originally interested in and if that opposite is true, then we simply return the function immediately. And so once again, this is a trait of more modern JavaScript. So kind of a trend that you will see in modern JavaScrip

      //create a new object after validation and pushing it to array
      workout = new Running([lat, lng], distance, duration, cadence);
      // this.#workouts.push(workout);
    }

    //If workout cycling,create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to positive numbers!'); //guard clause

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add new object to workout array
    this.#workouts.push(workout);
    

    //Render workout on map as marker
    this._renderWorkoutMarker(workout); //no need to use bind coz we are calling it ourselves

    //Render workout on list
    this._renderWorkout(workout);

    //Hide form + clear input fields
    this._hideForm();

    //Set local storage to all workouts
    this._setLocalStorage()

  }

  _renderWorkoutMarker(workout) {
    // const { lat, lng } = this.#mapEvent.latlng;
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      ) //we got this from documentation
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
  `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🗻</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
      `;
    //afterend will add a new element as a sibling element at the end of the form which we want here
    form.insertAdjacentHTML('afterend', html);
  }
  _movetoPopup(e) {
    const workoutEl = e.target.closest('.workout');
    

    if (!workoutEl) return;

    //trying to find which element was clicked so basically briding the website with the interface
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    

    //in leaflet there is method to move or pan the map to the object
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });

    //using the public interface
    //👇so this method you see right here would not work properly for objects coming from "local storage" coz becoz of stringify and parsing every object of local storage lost the prototype chain so thats why we are commenting this line and disabling it (and this method was introduce to study this drawback of OOPS of js only)
    // workout.click();

  }

  //saving the data in the local storage (its an API)
  _setLocalStorage() {
     //it👇 should be used for small amount of data and that becoz local storage is "blocking"
    localStorage.setItem('workouts', JSON.stringify(this.#workouts))
    //                pass in👆 the key
  }

  _getLocalStorage() {
    const data =JSON.parse(localStorage.getItem('workouts'));//as we would get data in string from so to we need to parse and thats why we used JSON.parse
    // to get data----------------------------pass👆 in the same key to get data which was used to set the items in localStorage
    

    if (!data) return;

    //restoring the data👇 from local storage
    this.#workouts = data;

    //rendering the data from local storage👇
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
      // this._renderWorkoutMarker(work);//it would not work now coz it gets called at the very beginning and at that time the map has not even loaded yet so we are commenting this line
    })
  }

  //for reseting or deleting all the data 
  reset() {
    localStorage.removeItem('workouts');//removing all the data
    location.reload();//reloading the page
  }
}

const app = new App();

