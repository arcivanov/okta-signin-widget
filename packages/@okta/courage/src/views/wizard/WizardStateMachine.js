define([
  'okta/underscore',
  'shared/models/Model'
], function (_, Model) {

  return Model.extend({

    props: {
      step: ['number', true, 0],
      error: ['boolean', true, false],
      done: ['boolean', true, false]
    },

    constructor: function (attrs, options) {
      this.__steps = _.map(options && options.steps || [], function (step) {
        return _.extend({substep: false}, step);
      });
      Model.apply(this, arguments);
      _.bindAll(this, 'nextStep', 'prevStep');
    },

    getCurrentStep: function () {
      return this.__steps[this.get('step')];
    },

    getSteps: function () {
      return _.map(this.__steps, _.clone);
    },

    getMajorSteps: function () {
      return _.where(this.getSteps(), {substep: false});
    },

    getSubStepsInfo: function (index) {
      var totalSubSteps = 0,
          doneSubSteps = 0,
          steps = this.getSteps();

      for (var i = index; i < steps.length; i++) {
        if (index == i || steps[i].substep) {
          totalSubSteps++;
          if (i < this.get('step')) {
            /*eslint max-depth: 0 */
            doneSubSteps++;
          }
        }
        else {
          break;
        }
      }
      return {
        total: totalSubSteps,
        done: doneSubSteps
      };
    },

    hasNextStep: function () {
      return this.__steps.length - 1 > this.get('step');
    },

    hasPrevStep: function () {
      return this.get('step') > 0;
    },

    nextStep: function () {
      if (this.hasNextStep()) {
        var currentStep = this.get('step');
        this.set({
          step: currentStep + 1,
          error: false
        });
      }
      else {
        this.set('done', true);
        this.trigger('wizard:done');
      }
    },

    prevStep: function () {
      if (this.hasPrevStep()) {
        var currentStep = this.get('step');
        this.set({
          step: currentStep - 1,
          error: false
        });
      }
    }

  });

});
