<template>
  <div class="course-exam">
    <waiter v-if="busy" class="course-exam__waiter"/>
    <div v-else>
      <component-header :header="'Экзамен по курсу'"
                        :description="'Для завершения курса и получения сертификата Вам необходимо правильно ответить на все вопросы.'"/>
      <exam-question class="course-exam__question"
                     v-for="question in questions"
                     :key="question.id"
                     :question-text="question.text"
                     :answer-variants="question.answers"
                     :wrong-answer="question.wrongAnswer"
                     @variant-chosen="(answer)=>variantChosen(question.id, answer)"/>
      <button type="button"
              class="btn btn-primary course-exam__submit"
              :disabled="!ready"
              @click="checkAnswers">
        Отправить
      </button>
    </div>
  </div>
</template>

<script>
  import waiter from '../controls/waiter';
  import examQuestion from '../controls/exam-question';
  import componentHeader from '../controls/component-header';
  import {getAccessKey} from "../api/videoApi";

  export default {
    components: {waiter, examQuestion, componentHeader},
    mounted() {
      this.loadModel();
    },
    data: () => ({
      busy: true,
      questions: [],
      answers: new Map(),
      ready: false,
    }),
    computed: {
      courseName: function () {
        return this.$route.params.courseName;
      }
    },

    methods: {
      async loadModel() {
        this.questions = (await this.$store.dispatch('fetchServer', ['getExam', this.courseName])).map(q => ({
          ...q,
          wrongAnswer: false
        }));
        this.busy = false;
      },
      variantChosen(questionId, index) {
        this.answers.set(questionId, index);

        const question = this.questions.find(q=>q.id === questionId);
        if(question)
          question.wrongAnswer = false;

        this.ready = this.answers.size !== 0 && this.answers.size === this.questions.length && this.questions.every(q => !q.wrongAnswer);
      },
      async checkAnswers() {
        const answersModel = {};
        for(const [questionId, answer] of this.answers){
          answersModel[questionId] = answer;
        }
        const serverResponse = await this.$store.dispatch('fetchServer', ['passExam', this.courseName, answersModel]);
        if (serverResponse.length === 0){
          this.$router.push(`/cabinet/myCertificates`);    
        }
        else {
          for (const wrongAnswer of serverResponse) {
            const question = this.questions.find(q => q.id === wrongAnswer);
            if(question)
              question.wrongAnswer = true;
          }
        }
      }
    },
  }
</script>
<style>
  .course-exam {
    padding-bottom: 10px;
    &__question {
      margin-bottom: 10px;
    }
  }
</style>
