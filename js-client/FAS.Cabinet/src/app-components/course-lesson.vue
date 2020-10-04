<template>
  <div class="course-lesson">
    <waiter v-if="busy" class="course-lesson__waiter"/>
    <div v-else>
      <component-header :header="'Урок №' + lessonNumber"
                        :description="answerVariants?'Для перехода к следующему уроку ответьте на контрольный вопрос после просмотра видео.' : 'При повторном просмотре видео отвечать на контрольный вопрос не нужно.'"/>
      <div v-if="videoUrl" class="course-lesson__content">
        <video-control :src="videoUrl"
                       :access-key="accessKey"
                       @update-access-key="updateAccessKey"
                       @ended="videoEndedHandler"
                       class="course-lesson__video"/>
        <div class="course-lesson__nav-bar" v-if="prevLessonUrl || nextLessonUrl || examUrl">
          <button type="button" class="btn btn-link course-lesson__prev-lesson" v-if="prevLessonUrl">
            <router-link :to="prevLessonUrl">
              К предыдущему уроку
            </router-link>
          </button>
          <button type="button" class="btn btn-link course-lesson__next-lesson" v-if="nextLessonUrl">
            <router-link :to="nextLessonUrl">
              К следующему уроку
            </router-link>
          </button>
          <button type="button" class="btn btn-link course-lesson__next-lesson" v-if="examUrl">
            <router-link :to="examUrl">
              Пройти тест
            </router-link>
          </button>
        </div>
        <div class="course-lesson__question" v-if="questionText">
          <p class="lead" v-if="!videoEnded">Здесь будет контрольный вопрос после окончания видео.</p>
          <div v-else>
            <p class="lead">Контрольный вопрос.</p>
            <exam-question :question-text="questionText"
                           :answer-variants="answerVariants"
                           :wrong-answer="wrongAnswer"
                           @variant-chosen="variantChosen"/>
            <button type="button"
                    class="btn btn-primary course-lesson__submit"
                    :disabled="currentAnswer == null"
                    @click="checkAnswer">Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import waiter from '../controls/waiter';
  import examQuestion from '../controls/exam-question';
  import componentHeader from '../controls/component-header';
  import videoControl from '../controls/video-control';
  import {getAccessKey} from "../api/videoApi";

  export default {
    components: {waiter, examQuestion, componentHeader, videoControl},
    mounted() {
      this.loadModel();
    },
    data: () => ({
      busy: true,
      videoUrl: '',
      lessonModel: null,
      videoEnded: false,
      currentAnswer: null,
      wrongAnswer: false,
    }),
    computed: {
      courseName: function () {
        return this.$route.params.courseName;
      },
      lessonIndex: function () {
        return this.$route.params.lessonIndex;
      },
      prevLessonUrl: function () {
        if (this.lessonModel && this.lessonModel.previousLessonIndex != null)
          return `/cabinet/course/${this.courseName}/lesson/${this.lessonModel.previousLessonIndex}`;
        return null;
      },
      nextLessonUrl: function () {
        if (this.lessonModel && this.lessonModel.nextLessonIndex != null && this.lessonModel.examQuestion == null)
          return `/cabinet/course/${this.courseName}/lesson/${this.lessonModel.nextLessonIndex}`;
        return null;
      },
      examUrl: function () {
        if (this.isNextLessonExam && this.lessonModel.examQuestion == null)
          return `/cabinet/course/${this.courseName}/exam`;
        return null;
      },
      lessonNumber: function () {
        return this.lessonModel ? this.lessonModel.index : null;
      },
      questionText: function () {
        return this.lessonModel && this.lessonModel.examQuestion ? this.lessonModel.examQuestion.text : null;
      },
      answerVariants: function () {
        return this.lessonModel && this.lessonModel.examQuestion ? this.lessonModel.examQuestion.answers : null;
      },
      isNextLessonExam: function () {
        return this.lessonModel && this.lessonModel.nextLessonIndex == null && !this.lessonModel.isCoursePassed;
      }
    },
    methods: {
      async loadModel() {
        const {lesson, token} = await this.$store.dispatch('fetchServer', ['getLesson', this.courseName, this.lessonIndex]);
        this.lessonModel = lesson;
        const {fileName} = lesson;
        this.accessKey = token;
        //const accessKey = await getAccessKey(fileName, token);
        this.videoUrl =`/video${fileName}/master.m3u8?_=` + Date.now();
        this.busy = false;
      },
      async loadAccessKey(){
        const {token} = await this.$store.dispatch('fetchServer', ['getLesson', this.courseName, this.lessonIndex]);
        return token;
      },
      videoEndedHandler() {
        this.videoEnded = true;
      },
      variantChosen(index) {
        this.currentAnswer = index;
        this.wrongAnswer = false;
      },
      async checkAnswer() {
        const {examQuestion} = this.lessonModel;
        if (examQuestion != null) {
          const serverResponse = await this.$store.dispatch('fetchServer', ['completeLesson', this.courseName, examQuestion.id, this.currentAnswer]);
          if (!serverResponse) {
            this.wrongAnswer = true;
          } else if (this.isNextLessonExam) {
            this.$router.push(`/cabinet/course/${this.courseName}/exam`);
          } else if (this.lessonIndex === 'current') {
            this.reset();
          } else
            this.$router.push(`/cabinet/course/${this.courseName}/lesson/current`);
        }
      },
      reset() {
        this.busy = true;
        this.videoUrl = '';
        this.accessKey = '';
        this.lessonModel = null;
        this.videoEnded = false;
        this.currentAnswer = null;
        this.wrongAnswer = false;
        setTimeout(() => this.loadModel(), 100);
      },
      async updateAccessKey(callback){
        const newAccessKey = await this.loadAccessKey();
        callback(newAccessKey);
      },
    },
    watch: {
      courseName: function () {
        this.reset();
      },
      lessonIndex: function () {
        this.reset();
      },
    },
  }
</script>
<style>
  .course-lesson {
    height: 100%;
    flex-direction: column;
    background-color: var(--theme_content-background-color);

    &__video {
      height: 380px;
      overflow: hidden;
      width: 680px;
      margin-left: 245px;
    }

    &__question {
      margin: 10px 0;
      padding: 0 5px;
    }

    &__submit {
      margin: 10px 0;
    }

    &__nav-bar {
      height: 50px;
      margin-bottom: 10px;
    }

    &__next-lesson {
      float: right;
    }
  }
</style>
