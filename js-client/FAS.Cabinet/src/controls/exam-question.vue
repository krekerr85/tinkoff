<template>
  <div class="exam-question">
    <div v-html='questionText' class='exam-question__content'></div>
    <div class="list-group">
      <button v-for="answer in answerVariants"
              :key="answer.index"
              :class="{ active: answer.index === currentIndex, 'bg-danger': wrongAnswer && answer.index === currentIndex}"
              type="button"
              @click="()=>buttonClickHandler(answer.index)"
              class="list-group-item list-group-item-action exam-question__answer-variant">
        {{answer.text}}
      </button>
    </div>
    <div class="exam-question__answer-result-area">
      <p v-if="wrongAnswer" class="exam-question__wrong-answer">
        Неверный ответ
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      questionText: String,
      answerVariants: Array,
      answerChosen: Function,
      wrongAnswer: Boolean,
    },
    data: () => ({
      currentIndex: null,
    }),
    methods: {
      buttonClickHandler: function (index) {
        this.currentIndex = index;
        this.$emit('variant-chosen', index);
      }
    }
  }
</script>
<style>
  .exam-question {
    
    &__answer-variant {
      cursor: pointer;
    }
    &__wrong-answer {
      margin: 0;
      color: var(--theme_wrong-answer-color);
    }
    &__answer-result-area {
      margin-bottom: 10px;
      margin-top: 5px;
      min-height: 25px;
    }
  }
  .exam-question__content{
    display: flex;
    flex-direction: row-reverse;
  }
  .exam-question__content p{
    flex: 1;
  }
  .exam-question__content img{
    width: 200px;
    margin: 0 10px 10px 
  }
</style>
