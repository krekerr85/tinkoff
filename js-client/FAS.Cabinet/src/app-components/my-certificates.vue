<template>
  <div class="my-certificates">
    <waiter v-if="busy"/>
    <div v-else>
      <component-header :header="'Мои сертификаты'"
                        :description="'Здесь находятся получнные по окончании каждого курса сертификаты.'"/>
      <div class="my-certificates__alert" v-if="certificates.length>0">
      Чтобы не забыть ценную информацию, приобретенную на курсе, мы сделали для вас Справочник по первой помощи, который вы можете приобрести  <router-link :to="shopUrl">здесь</router-link>
      </div>
      <div class="my-certificates__list">
        <div class="my-certificates__list-item"
             v-for="item in certificates"
             @click="onItemClicked(item)"
             :key="item.registrationNumber">
          <img class="my-certificates__list-item-image card-img-top"
               :src="item.previewImage"/>
          <div class="card-body" :class="{ 'my-certificates__list-item_not-approved': !item.isApproved}">
            <h5 class="card-title">{{item.courseName}}</h5>
            <p class="card-text my-certificates__list-item-text">{{item.description}}</p>
          </div>
        </div>
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
      this.tryLoadMyCertificates();
    },
    data: () => ({
      busy: true,
      certificates: [],      
      shopUrl: '/cabinet/shop',
    }),
    components: {waiter, courseCard, componentHeader},
    methods: {
      async tryLoadMyCertificates() {
        this.busy = true;
        const myCertificates = await this.$store.dispatch('fetchServer', ['getMyCertificates']);
        this.certificates = myCertificates.map(c => {
          return {
            ...c,
            previewImage: require('../assets/certificatePreview.png'),
            description: c.isApproved ? `Выдан на имя ${c.userSurname} ${c.userFirstname}` : 'Сертификат не заполнен!'
          }
        });
        this.busy = false;
      },
      onItemClicked(item) {
        if (!item.isApproved) {
          this.showModal({...item});
        } else
          this.downloadCertificate(item);
      },
      showModal(item) {
        const fields = [
          {
            caption: 'Фамилия',
            value: '',
            required: true
          },
          {
            caption: 'Имя',
            value: '',
            required: true
          },
          {
            caption: 'Отчество',
            value: '',
            name: 'user-patronymic',
          },];
        this.$store.commit('showModal', {header: 'Укажите получателя сертификата', fields: fields, onAccepted: this.handleModalAccepted, cert: item, needValidate: true});
      },
      handleModalAccepted({fields, cert}){
        cert.userSurname = fields[0].value;
        cert.userFirstname = fields[1].value;
        cert.userPatronymic = fields[2].value;
        this.saveCertificate(cert);
      },
      async saveCertificate(certificate) {
        await this.$store.dispatch('fetchServer', ['postCertificate', certificate]);
        certificate.isApproved = true;
        certificate.description = certificate.isApproved ? `Выдан на имя ${certificate.userSurname} ${certificate.userFirstname}` : 'Сертификат не заполнен!'
        this.certificates = this.certificates.map(c => {
          if (c.id === certificate.id)
            return certificate;
          return c;
        });
      },
      downloadCertificate(item) {
        window.open('/api/userCertificate/' + item.id, '_blank');
      }
    }
  }
</script>
<style>
  .my-certificates {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--theme_content-background-color);

    &__header {

    }

    &__alert{
      color: var(--theme_accent-color);
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      margin-left: -6px;

      &:after {
        content: '';
        flex-grow: 2;
      }
    }

    &__list-item {
      flex: 1 0 initial;
      margin-left: 6px;
      margin-bottom: 10px;
      cursor: pointer;

      &_not-approved {
        color: red;
      }
    }

    &__list-item-image {
      width: 286px;
      height: 181px;
    }

    &__list-item-text {
      max-height: 100px;
      overflow: hidden;
    }
  }
</style>
