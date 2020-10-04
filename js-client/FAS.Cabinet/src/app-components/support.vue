<template>
  <div class="support-container">
      <waiter v-if="busy"/>
    <div class="support" v-else>
      <component-header :header="'Чат с техподдержкой'"
                        :description="'Здесь Вы можете задать вопросы по курсам.'"/>      
      <div class="support__message-collection">
        <div class="support__update-button">
          <button type="button"
                  v-if="hasData"
                  class="btn btn-primary" @click="loadNextPage">Загрузить ещё</button>
        </div>
        <div v-for="message in messages" 
            class="technical-message"
            :class="{'technical-message_question': message.isQuestion, 'technical-message_answer': message.isAnswer, 'technical-message_my': message.isMy}"
            :key="message.id"
            >
          <div class="technical-message__content">
            <div class="technical-message__author">
              {{message.authorName}}
            </div>
            <div class="technical-message__text">
              {{message.messageText}}
            </div>
          </div>
        </div>
      </div>    
      <form class="support__new-message-container creation-technical-message" @submit="sendNewMessage">  
        <textarea class="creation-technical-message__text"/>
        <button type="submit"
                class="btn btn-primary creation-technical-message__send">Отправить</button>
      </form>   
    </div>      
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import waiter from '../controls/waiter';
  import componentHeader from '../controls/component-header';
  import {formatDate} from '../utils/date-utils';

  const PAGE_SIZE = 30;

  export default {
    async mounted() {
      await this.loadNextPage();
      this.scrollToBottom();
    },
    data: () => ({
      busy: true,
      messages: [],
      hasData: true,
      messageIds:{},
      questionCount: 0,
    }),
    computed: mapState({
      user: state => ({...state.currentUser})
    }),
    components: {waiter, componentHeader},
    methods: {
      async loadNextPage() {
        this.busy = true;

        const messages = await this.$store.dispatch('fetchServer', ['getTechSupportMessages', this.questionCount, PAGE_SIZE]);
        if(messages.length!=PAGE_SIZE)
          this.hasData = false;
        for(const m of messages) {
          if(this.messageIds[m.id])
            continue;
          this.messageIds[m.id] = true;
          this.questionCount++;
          if(m.answers!=null)          {
            for(const a of m.answers.reverse()){
              if(this.messageIds[a.id])
                continue;
              this.messageIds[a.id] = true;
              this.messages.splice(0, 0, this.convertMessage(a, true));    
            }
          }
          this.messages.splice(0, 0, this.convertMessage(m));
        }
        
        this.busy = false;
      },
      scrollToBottom(){
        const el = this.$el.querySelector('.support__message-collection');
        if(el)
          el.scrollTop = el.scrollHeight;
      },
      async sendNewMessage(e){
        if (event.preventDefault)
          event.preventDefault();

        const text = this.$el.querySelector('textarea').value;
        this.$el.querySelector('textarea').value = '';
        if(text){
          const message = await this.$store.dispatch('fetchServer', ['createTechSupportMessages', text]);
          this.messageIds[message.id] = true;
          this.questionCount++;
          this.messages.push(this.convertMessage(message));
          setTimeout(()=>this.scrollToBottom(), 10);
        }          
        return false;        
      },
      convertMessage(serverMessage, isAnswer){
        return {
          ...serverMessage, 
          creationTime: formatDate(serverMessage.creationTime), 
          isAnswer: isAnswer, 
          isQuestion: !isAnswer,
        };
      }
    }
  }
</script>
<style>
  .support-container {      
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
  }
  .support { 
    height: 100%;
    width: 100%;     
    display: flex;
    flex-direction: column;
    background-color: var(--theme_content-background-color);
    padding-bottom:10px;
    
    &__update-button{
      text-align: center;
    }

    &__message-collection{
      flex:1;
      overflow: auto;
    }

    &__new-message-container{
      background-color: var(--theme_main-background);
    }
  }

  .technical-message {
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      border: var(--theme_border-style);
      border-width: 0 0 1px 0;
      
      
      &_answer{
        text-align: right;
        align-items: flex-end;
      }

      &_my{
        .technical-message__author{
          font-weight: bold;
          color: var(--theme-technical-message-my-message-color);
        }
      }

      &__content{
        width: 80%;
        border-radius: 10px;
        padding: 5px 10px;
      }
      
      &__author{
        font-size: var(--font-size_small);
      }
      
      &__text{
        
      }
    }

    .creation-technical-message{
      display: flex;
      flex-direction: row;      
      align-items: center;
      padding-right:3px;

      &__text{
        resize: none;
        flex: 1;
        margin-right: 10px;
        height: 100px;
      }
      &__send{
      }
    }
</style>
