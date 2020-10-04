<template>

  <waiter v-if="busy"/>
  <div v-else class="course-view">    
    <div class="course-view__detail">
      <div class="course-view__avatar" style="background-color: white">
        <span class="icon-plus" style="font-size: 150px; color: red;"></span>
      </div>
      <div class="course-view__text-description">
        <div class="course-view__field">
          <span class="course-view__label">Название:</span>
          <span class="course-view__value">{{course.caption}}</span>
        </div>
        <div class="course-view__field">
          <span class="course-view__label">Количество уроков:</span>
          <span class="course-view__value">{{course.duration}}</span>
        </div>
        <div class="course-view__field">
          <span class="course-view__label">Описание:</span>
          <span class="course-view__value" v-html='course.description'></span>
        </div>
        <div class="course-view__field">
          <button class="btn btn-primary" @click="buyClickHandler">Купить</button>
        </div>
        
      </div>
    </div>
  </div>

</template>
<script>
  
  import waiter from '../controls/waiter';

  export default {
    components: {waiter},
    mounted() {
      this.loadCourses();
    },
    data: () => ({
      busy: true,
      course: null,
    }),
    computed: {
      courseName: function () {
        return this.$route.params.name;
      }
    },
    methods: {
      async loadCourses() {
        this.busy = true;
        this.course = await this.$store.dispatch('fetchServer', ['getCourse', this.courseName]);
        this.course.lessons = this.course.lessons ? this.course.lessons.map(l => ({
          ...l,
          url: `/cabinet/course/${this.courseName}/lesson/${l.index}`
        })) : [];
        this.busy = false;
      },
      async buyClickHandler() {
        const {courseCost, additionalCertificateCost} = await this.$store.dispatch('fetchServer', ['getCourseCost', this.course.id]);
        let certCount = 1;
        const fields = [
          {
            caption: 'Количество сертификатов',
            get value(){
              return certCount;
            },
            set value(newVal){
              certCount = newVal;
              fields[1].value = courseCost + (certCount -1 ) * additionalCertificateCost;
            },
            type:'select',
            options:[{value: 1},{value: 2},{value: 3},{value: 4},{value: 5}]
          },
          {
            caption: 'Стоимость курса',
            value: courseCost + (certCount-1) * additionalCertificateCost,
            readonly: true
          },];
          const description = 'После прохождения курса Вы получите сертификат. Выберите нужное количество. Стоимость дополнительного сертификата - ' + additionalCertificateCost +' руб.'
        this.$store.commit('showModal', {header: 'Покупка курса', fields: fields, description: description, onAccepted: this.handleModalAccepted, needValidate: true});
      },
      async handleModalAccepted({fields}){
        const data = {CourseId: this.course.id, CertificateCount: fields[0].value};
        const response = await this.$store.dispatch('fetchServer', ['buyCourse', data]);
        this.sendForm(response.paymentRequestUrl, response.data);
      },
      sendForm(url, data){
        var form = document.createElement("form");
        
        for(const name in data) {
          const el = document.createElement("input"); 
          el.value=data[name];
          el.name=name;
          form.appendChild(el);  
        }
        form.method = "POST";
        form.action = url;   
        document.body.appendChild(form);
        form.submit();
      }
    }
  }
</script>

<style>
  .course-view {
    display: flex;
    flex-direction: row;
    color: var(--theme_text-color);

    &__detail {
      flex: 1;
      display: flex;
    }

    &__avatar {      
      width: 200px;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px 10px 0;
    }

    &__field {
      margin: 10px 0;
    }

    &__label {
      font-weight: bold;
    }
  }

</style>
