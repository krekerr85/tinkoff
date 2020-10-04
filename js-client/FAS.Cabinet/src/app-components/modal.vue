<template>
  <div>
    <div class="modal fade my-certificates__modal" tabindex="-1" role="dialog" aria-hidden="true">
      <form novalidate="novalidate"
            role="document"
            class="modal-dialog"
            v-bind:class="{'was-validated': wasValidate}"
            v-on:submit.prevent.stop="handleModalApproved">
        <div class="modal-content" v-if="currentState">
          <div class="modal-header">
            <h5 class="modal-title">{{currentState.header}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              {{currentState.description}}
            </div>
            <div class="form-group"
                 v-for="(field, index) in currentState.fields">
              <label class="col-form-label">{{field.caption}}:</label>
              <select class="form-control"
                      v-model="field.value"
                      v-bind:required="field.required"
                      v-bind:readonly="field.readonly"
                      v-bind:class="{'is-invalid': !field.isValid}"
                      v-bind:id="'form-control-'+ index"
                      v-if="field.type === 'select'">
                <option v-for="option in field.options" v-bind:value="option.value">{{option.text || option.value}}</option>
              </select>
              <input class="form-control"
                     v-else
                     v-bind:type="field.type || 'text'"
                     v-bind:required="field.required"
                     v-bind:readonly="field.readonly"
                     v-bind:class="{'is-invalid': !field.isValid}"
                     v-bind:id="'form-control-'+ index"
                     v-bind:min="field.min"
                     v-bind:name="field.name"
                     v-bind:max="field.max"
                     v-bind:step="field.step"
                     v-model="field.value">
              <div class="invalid-feedback" v-if="!field.isValid || field.validationError">
                {{field.validationError}}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-primary">Подтвердить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    mounted() {
      this.$store.watch(
        (state, getters) => getters.currentModalState,
        (newValue) => {
          if (newValue) {
            this.$set(this, 'currentState', newValue);
            this.showModal();
          } else {
            this.closeModal();
          }
        },
      );
      this.modalContentEl = this.$el.getElementsByClassName('my-certificates__modal')[0];
      $(this.modalContentEl).modal({show: false, backdrop: false, keyboard: true});
      $(this.modalContentEl).on('hidden.bs.modal', this.handleModalCanceled);
      this.form = this.$el.getElementsByTagName('form')[0];
    },
    data: () => ({
      currentState: null, //{header: '', description: '', fields: [{caption: '', value: '', required: boolean, readonly: boolean}], onCancel: (currentState)=> void, onAccepted: (currentState)=> void, onValidate: (currentState) => boolean}
      modalContentEl: null,
      form: null,
    }),
    computed: {
      wasValidate: function () {
        return this.currentState && this.currentState.wasValidate;
      },
    },
    methods: {
      showModal() {
        $(this.modalContentEl).modal('show');
      },
      closeModal() {
        $(this.modalContentEl).modal('hide');
      },
      handleModalCanceled() {
        if (this.currentState && this.currentState.onCancel && !this.currentState.accepted)
          this.currentState.onCancel(this.currentState);
        this.$store.commit('closeLastModal');
      },
      handleModalApproved() {
        if (!this.currentState)
          return;

        if (this.currentState.needValidate && !this.validate(this.currentState))
          return;

        this.currentState.accepted = true;    
        const {onAccepted} = this.currentState;
        if (onAccepted)
          onAccepted(this.currentState);
        this.$store.commit('closeLastModal');
      },
      validate(state) {
        state.wasValidate = true;

        let valid = this.form.checkValidity();
        if(this.currentState.onValidate)
          valid = this.currentState.onValidate(this.currentState) && valid;

        const {fields} = this.currentState;

        for(let i=0; i<fields.length; i++){
          const fd = fields[i];
          const fieldElement = document.getElementById('form-control-' + i);
          if(!fieldElement)
            continue;
          if(fd.isValid)
            fieldElement.setCustomValidity('');
          else
            fieldElement.setCustomValidity('Please validate');
        }

        return valid;
      }
    }
  }
</script>
<style>
</style>
