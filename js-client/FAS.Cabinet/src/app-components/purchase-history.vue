<template>
  <div class="purchase-history">
    <waiter v-if="busy"/>
    <div v-else>
        <component-header :header="'История покупок'"
                        :description="'Здесь находятся все покупки, сделанные на сайте.'"/>
        <table class='table purchase-history__table'>
            <thead>
                <tr>
                    <th class='purchase-history__header-cell purchase-history__number-cell'>№</th>
                    <th class='purchase-history__header-cell purchase-history__date-cell'>Дата</th>
                    <th class='purchase-history__header-cell purchase-history__amount-cell'>Цена</th>
                    <th class='purchase-history__header-cell purchase-history__status-cell'>Статус</th>
                    <th class='purchase-history__header-cell purchase-history__desc-cell'>Описание</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in history">
                    <th class='purchase-history__number-cell' :title='item.number'>{{item.number}}</th>
                    <td class='purchase-history__date-cell' :title='item.creationTime'>{{item.creationTime}}</td>
                    <td class='purchase-history__amount-cell' :title='item.amount'>{{item.amount}} р.</td>
                    <td class='purchase-history__status-cell' :title='item.status'>{{item.status}}</td>
                    <td class='purchase-history__desc-cell' :title='item.name'>{{item.name}}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
  import waiter from '../controls/waiter';
  import courseCard from './course-card';
  import componentHeader from '../controls/component-header';
  import { formatDate }  from '../utils/date-utils';

  export default {
    mounted() {
      this.tryLoadHistory();
    },
    data: () => ({
      busy: true,
      history: [],
    }),
    components: {waiter, componentHeader},
    methods: {
      async tryLoadHistory() {
        this.busy = true;
        const history = await this.$store.dispatch('fetchServer', ['getHistory']);
        this.history = history.map((c, num) => ({
            ...c,
            creationTime: formatDate(c.creationTime),
            number: num + 1,
            status: this.getStatus(c.state)
        }));
        this.busy = false;
      },
      getStatus(orderState){
           switch(orderState){
                case 'WaitForApprove': 
                    return 'Ожидает оплаты';
                case 'Approved':
                    return 'Оплачен';
                case 'Rejected':
                    return 'Отменен';
           } 
      },
    }
  }
</script>
<style>
  .purchase-history {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--theme_content-background-color);

    &__header-cell {
        border-top-width:0px !important;
        font-weight: bold;
    }

    &__number-cell {
        width: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__date-cell {
        width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__amount-cell {
        width: 150px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }    

    &__status-cell {
        width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    &__desc-cell {
        overflow: hidden;
    }    
  }
</style>
