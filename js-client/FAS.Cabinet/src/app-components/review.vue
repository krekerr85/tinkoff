<template>
<div>
<form class="new-review needs-validation" novalidate @submit="handleSubmit" id="new-review">
    <transition name="modal-transition">
    <div class="modal-reviews" v-if="modalIsOpen">
      <div @click="closeModal" class="modal-background"></div>
      <div class="modal-content">
        
          <div @click="closeModal" class="closebutton">
            &times;
          </div>
            <div class="modal-headerer"> Написать отзыв</div>
            <input v-model="reviewName" type="text" class="form-control" id="FirstName" name="FirstName" placeholder="Ваше имя" required />
            <div class="invalid-feedback" v-if="$v.reviewName.$dirty && !$v.reviewName.required"> Пожалуйста введите имя </div>
            <input v-model="reviewSocnet" type="text" class="form-control" id="SocNet" name="SocNet" placeholder="Ссылка на вашу страницу в социальной сети" />
            <textarea  v-model.trim="reviewText" class="form-control" id="ReviewText" name="ReviewText" placeholder="Ваш отзыв" required ></textarea>
            <div class="invalid-feedback" v-if="$v.reviewText.$dirty && !$v.reviewText.required"> Пожалуйста введите отзыв </div>
            <div class="invalid-feedback" v-if="$v.reviewText.$dirty && !$v.reviewText.minLength"> Минимальная длина отзыва 40 символов </div>
            <button type="submit" class="btn btn-primary send-review" >Отправить отзыв</button>
        
      </div>
            

    </div>
    </transition>
    </form>
    <transition name="modal-transition">
    <div class="notification-review" v-if="notificationReview">
              <div class="notification-review-text">
                Спасибо за ваш отзыв!
              </div>
              </div>
    </transition>

</div>
</template>

<script>
  import {required, minLength} from "vuelidate/lib/validators";
  import {mapState} from "vuex";
  import {sleep} from '../utils/async-utils';

  export default {
    name: 'review',
    props: ['modalOpened'],
    data() {
      return {
        reviewName : '',
        reviewSocnet: '',
        reviewText: '',
        notificationReview: false
      }
    
    },
    computed: mapState({
      userName: state => {
        const {currentUser} = state;
        if (currentUser == null)
          return null;

        if (currentUser.firstname && currentUser.surname)
          return `${currentUser.firstname} ${currentUser.surname}`;

        if (currentUser.firstname)
          return currentUser.firstname;

        if (currentUser.surname)
          return currentUser.surname;

        return ''
      },

      modalIsOpen() {
            if (this.modalOpened){
                this.reviewText = '',
                this.reviewSocnet = '',
                this.reviewName = this.userName
                return this.modalOpened
            }
            else return false
        },
      
    }),
    

    methods: {        
      closeModal() {
        this.$emit("isOpen", false);
      },
      handleSubmit(event) {
        if (event.preventDefault)
          event.preventDefault();
        if (this.$v.$invalid){
          this.$v.$touch()
          console.log(this.$v)
          return
        }
        else{
          
        this.sendNewReview();
        return false;
        }
      },
      async sendNewReview() {
        const form = {
          FirstName: this.reviewName,
          SocNet: this.reviewSocnet,
          ReviewText: this.reviewText,
        }
        await this.$store.dispatch('fetchServer', ['createReview', form]);
        this.closeModal();
        await this.notificationReviewSended();
      },
      async notificationReviewSended() {
        this.notificationReview = true;
        await sleep(2500);
        this.notificationReview = false;
      },
    },
    validations: {
      reviewName: {required},
      reviewText: {required, minLength: minLength(40)}
    }
  }

</script>


<style>

  .notification-review {
    display:flex;
    align-items:center;
    justify-content: center;
    color: black;
    background-color: white;
    position:absolute;
    left: 1060px;
    bottom: 550px;
    width: 200px;
    height: 50px;
    z-index:100;
    border: 1px solid black;
    border-radius: 15px;
    transition: opacity 0.5s ease, transform 1s ease;

}
  .notification-review-text{
    font-size: 12px;
    display: block;
    align-items:center;
    justify-content: center;
    
}

  .modal-reviews, .modal-background {
    position:absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
   
}
.modal-background {
    background-color: rgba(10,10,10,0.8);
    z-index: 40;
    overflow: hidden;
}
.modal-reviews {
    display:flex;
    align-items:center;
    justify-content: center;
    background-color: initial;
    color: initial;
    transition: opacity 0.5s ease, transform 1s ease;
    z-index:100;
}
.modal-content {
    display: block;
    background-color: white;
    width: 650px;
    height: auto;
    padding: 2em;
    z-index:200;
    align-items:center;
    justify-content: center;

}
.closebutton {
  position:absolute;
  margin-left: 578px;
  font-size: 35px; 
  color: #808080; 
  font-weight: bold; 
  font-family: helvetica,arial; 
  line-height: 1;
  cursor: pointer;
}
.modal-transition-enter-active {
  opacity: 1;
  
}
.modal-transition-enter {
  opacity: 0;
  transform: scale(1.1,1.1);
}
.modal-transition-leave-active {
  opacity: 0;
  transform: scale(1.1,1.1);
}
.modal-transition-leave {
  opacity: 1;
}
input[type=text] {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid grey;
}
.modal-headerer{
  justify-content: left;
  font-size:20px;
  margin-left:15px;
}
textarea {
  width: 100%;
  height: 160px!important;
  padding: 12px 20px;
  box-sizing: border-box;
  resize: none;
  border: none!important;
  border-bottom: 2px solid grey!important;
}
.send-review{
  display: block;
  margin-top:20px;
}
.invalid-feedback {
    display: block;
    
}
:focus::-webkit-input-placeholder {
  color: transparent
}
 
:focus::-moz-placeholder {
  color: transparent
}
 
:focus:-moz-placeholder {
  color: transparent
}
 
:focus:-ms-input-placeholder {
  color: transparent
}


</style>
