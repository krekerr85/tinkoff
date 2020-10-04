<template>
  <div class="my-courses">
    <waiter v-if="busy"/>
    <div v-else>
      <component-header :header="'Мои курсы'"
                        :description="'Здесь находятся все купленные вами и активные на данный момент курсы. После оплаты курсы становятся доступны через 5-10 минут.'"/>
      <div class="my-courses__list">
        <course-card class="my-courses__list-item"
                     v-for="item in courses"
                     @click='handleClick(item, $event)'
                     :key="item.name"
                     :image="item.image"
                     :hover-image="item.animation"
                     :header="item.caption"
                     :href="item.url"
                     :description="item.shortDescription"/>
      </div>
    </div>
  </div>
</template>

<script>
  import waiter from '../controls/waiter';
  import courseCard from './course-card';
  import componentHeader from '../controls/component-header';

  export default {
    mounted() {
      this.tryLoadMyCourses();
    },
    data: () => ({
      busy: true,
      courses: [],
    }),
    components: {waiter, courseCard, componentHeader},
    methods: {
      async tryLoadMyCourses() {
        this.busy = true;
        const serverCourses = await this.$store.dispatch('fetchServer', ['getMyCourses']);
        this.courses = serverCourses.map(c => ({
          ...c,
          url: c.examOnly ? `/cabinet/course/${c.name}/exam` : `/cabinet/course/${c.name}/lesson/current`,
          image: '/api' + c.image,
          animation: c.animation ? '/api' + c.animation : '/api' + c.image
        }));
        this.busy = false;
      },  
      handleClick(item, e){
        if(item.needBuyAdditionalCertificates){
          e.preventDefault();
          this.offerBuyAdditionalCertificates(item);
        }        
      },   
      async offerBuyAdditionalCertificates(item){
        const certificateCost = await this.$store.dispatch('fetchServer', ['getCertificatesCost', item.name]);
        if(certificateCost == null)
          return;
        
        let certCount = 1;
        const fields = [
          {
            caption: 'Количество доп сертификатов',
            get value(){
              return certCount;
            },
            set value(newVal){
              certCount = newVal;
              fields[1].value = certCount * certificateCost;
            },
            type:'select',
            options:[{value: 1},{value: 2},{value: 3},{value: 4},{value: 5}]
          }];
          const description = 'Докупите нужное количество ДОПОЛНИТЕЛЬНЫХ сертификатов. После начала прохождения курсов докупить сертификаты будет нельзя. Стоимость дополнительного сертификата - ' + certificateCost +' руб.'
        this.$store.commit('showModal', {header: 'Покупка дополнительных сертификатов', fields: fields, description: description, onAccepted: (...args) => {this.handleModalAccepted(item.name, ...args)}, needValidate: true, onCancel:()=>this.navigateToCourse(item.url)});
      },
      async handleModalAccepted(courseName, {fields}){
        const data = {CourseName: courseName, CertificateCount: fields[0].value};
        const response = await this.$store.dispatch('fetchServer', ['buyCertificates', data]);
        this.sendForm(response.paymentRequestUrl, response.data);
      },
      navigateToCourse(url){
        this.$router.push(url);
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
  .my-courses {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--theme_content-background-color);

    &__header {

    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      margin-left: -6px;
      padding-bottom: 10px;

      &:after {
        content: '';
        flex-grow: 2;
      }
    }

    &__list-item {
      flex: 1 0 initial;
      margin-left: 6px;
      margin-bottom: 10px;
    }
  }
</style>
