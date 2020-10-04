<template>
  <div class="goods-collection">
    <waiter v-if="busy"/>
    <div v-else>
      <component-header :header="'Магазин'"
                        :description="'Здесь вы можете что-то купить.'"/>
      <div class="goods-collection__list">
        <div class="goods-collection__list-item"
             v-for="item in goods"
             @click="onItemClicked(item)"
             :key="item.id">
          <img class="goods-collection__list-item-image card-img-top"
               :src="item.image"/>
          <div class="card-body">
            <h5 class="card-title">{{item.caption}}</h5>
            <p class="card-text goods-collection__list-item-text">{{item.shortDescription}}</p>
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
      this.tryLoadGoods();
    },
    data: () => ({
      busy: true,
      goods: [],
    }),
    components: {waiter, courseCard, componentHeader},
    methods: {
      async tryLoadGoods() {
        this.busy = true;
        const goods = await this.$store.dispatch('fetchServer', ['getGoodsCollection']);
        this.goods = goods.map(c => {
          return {
            ...c,
            image: '/api' + c.image
          }
        });
        this.busy = false;
      },
      onItemClicked(item) {
        this.showModal({...item});
      },
      showModal(item) {
        let goodsCount = 1;
        const fields = [
          {
            caption: 'Стоимость',
            value: item.cost * goodsCount,
            readonly: true
          },
          {
            caption: 'Количество',
            get value(){
              return goodsCount;
            },
            set value(newVal){
              goodsCount = newVal;
              fields[0].value = item.cost * newVal;
            },
            type: 'number',
            required: true,
            min: 1,
            step: 1,
          },
          {
            caption: 'Индекс',
            value: '',
            name: 'index',
            required: true
          },
          {
            caption: 'Область',
            value: '',
            name: 'region',
            required: true
          },
          {
            caption: 'Район',
            value: '',
            name: 'area',
            required: false
          },
          {
            caption: 'Населенный пункт',
            value: '',
            name: 'city',
            required: true
          },
          {
            caption: 'Улица',
            value: '',
            name: 'street',
            required: true
          },
          {
            caption: 'Дом/строение/корпус',
            value: '',
            name: 'house',
            required: true
          },
          {
            caption: 'Квартира',
            value: '',
            name: 'flat',
            required: true
          },
          {
            caption: 'ФИО получателя',
            value: '',
            name: 'receiverName',
            required: true
          },];
        this.$store.commit('showModal', {header: 'Укажите количество и адрес доставки', fields: fields, onAccepted: this.handleModalAccepted, goods: item, needValidate: true});
      },
      async handleModalAccepted({fields, goods}){
        const request = {
          goodsId: goods.id,
          count: fields[1].value,
          postCode: fields[2].value,
          region: fields[3].value,
          area: fields[4].value,
          city: fields[5].value,
          street: fields[6].value,
          house: fields[7].value,
          flat: fields[8].value,
          receiverName: fields[9].value,
        };
        const response = await this.$store.dispatch('fetchServer', ['buyGoods', request]);
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
  .goods-collection {
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
