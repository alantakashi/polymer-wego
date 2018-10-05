import { PolymerElement } from '@polymer/polymer/polymer-element.js'

(function () {
  'use strict'

        /**
        * @constructor
        * @implements {Polymer_OptionalMutableData}
        * @extends {Polymer.Element}
        */
  const domRepeatBase = Polymer.OptionalMutableData(PolymerElement)

        /**
        * A template element that repeat `n` times its content.
        *
        * Example:
        *
        *     <template is="dom-repeat-n" count="3">
            *       <div>I am div {{index}}</div>
            *     </template>
            *
            * @demo demo/index.html
            * @customElement
            * @polymer
            * @memberof Polymer
            * @extends Polymer.Element
            * @appliesMixin Polymer.MutableData
            * @summary Custom element for stamping instance of a template bound to items in an array.
            */

  class DomRepeatN extends domRepeatBase {
    static get is () { return 'dom-repeat-n' }
                // The following specifies that the element stamp directly no content,
                // i.e. does not have a <template> section declared
    static get template () { return null }

    static get properties () {
                    /**
                    * Fired whenever DOM is added or removed by this template (by
                    * default, rendering occurs lazily).
                    *
                    * @event dom-change
                    */

      return {
                        /**
                        * `count` specifies the number of times to repeat the template content.
                        */
        count: {
          type: Number,
          value: 0,
          observer: '__countChanged'
        },

                        /**
                        * `start` specifies the value of the first index and default to 0.
                        */
        start: {
          type: Number,
          value: 0,
          observer: '__startChanged'
        },

                        /**
                        * `increment` specifies the increment value between indices.
                        */
        increment: {
          type: Number,
          value: 1,
          observer: '__incrementChanged'
        },

                        /**
                        * The name of the variable to add to the binding scope with the index
                        * for the templates instances.
                        */
        indexAs: {
          type: String,
          value: 'index'
        }
      }
    }

                // Element Lifecycle

    constructor () {
      super()
      this.__instances = []
      this.__pool = []
      this.__renderDebouncer = null
      this.__ctor = null
      this.__isDetached = true
      this.template = null
    }

    disconnectedCallback () {
      super.disconnectedCallback()
      this.__isDetached = true
      for (var i = 0; i < this.__instances.length; i++) {
        this.__detachInstance(i)
      }
    }

    connectedCallback () {
      super.connectedCallback()
                    // only perform attachment if the element was previously detached.
      if (this.__isDetached) {
        this.__isDetached = false
        var parent = this.parentNode
        for (let i = 0; i < this.__instances.length; i++) {
          this.__attachInstance(i, parent)
        }
      }
    }

                // Element Behavior
    __ensureTemplatized () {
                    // Templatizing (generating the instance constructor) needs to wait
                    // until ready, since won't have its template content handed back to
                    // it until then
      if (!this.__ctor) {
        let template = this.template = this.querySelector('template')
        if (!template) {
                            // Wait until childList changes and template should be there by then
          let observer = new MutationObserver(() => {
            if (this.querySelector('template')) {
              observer.disconnect()
              this.__render()
            } else {
              throw new Error('dom-repeat requires a <template> child')
            }
          })
          observer.observe(this, {childList: true})
          return false
        }
        this.__ctor = Polymer.Templatize.templatize(template, this, {
          mutableData: this.mutableData,
          parentModel: true
        })
      }
      return true
    }

    _countChanged (newCount, oldCount) {
      if (parseInt(newCount)) {
        newCount = parseInt(newCount)
      }
      if (typeof (newCount) !== 'number') {
        this.count = oldCount
        console.error('dom-repeat-n: count should be a number')
        return
      }
      if (newCount < 0) {
        this.count = oldCount
        console.error('dom-repeat-n: count cannot be negative')
        return
      }
                    // we use async to enable ready to be called before this code
      this.async(function () {
        var i
                        // Generate possible missing instances if count increased
        for (i = 0; i < newCount; i++) {
          var inst = this.__instances[i]
          if (!inst) {
            inst = this._insertInstance(i)
          }
        }
                        // Remove any extra instances from previous state
        var limit = this.__instances.length
        for (i = limit - 1; i > newCount - 1; i--) {
          this._detachAndRemoveInstance(i)
        }
        this._debounceTemplate(this._render)
        this.fire('dom-change')
      })
    }

    _startChanged (newStart, oldStart) {
      if (typeof (newStart) !== 'number') {
        this.start = oldStart
        console.error('dom-repeat-n: start should be a number')
        return
      }
      this._debounceTemplate(this._render)
    }

    _incrementChanged (newIncrement, oldIncrement) {
      if (typeof (newIncrement) !== 'number') {
        this.increment = oldIncrement
        console.error('dom-repeat-n: start should be a number')
        return
      }
      this._debounceTemplate(this._render)
    }

    _render () {
      for (var i = 0, k = this.__instances.length; i < k; i++) {
        var inst = this.__instances[i]
        inst.__setProperty(this.indexAs, i * this.increment + this.start, true)
      }
    }

    _attachInstance (idx, parent) {
      var inst = this.__instances[idx]
      parent.insertBefore(inst.root, this)
    }

    _detachInstance (idx) {
      var inst = this.__instances[idx]
      for (var i = 0; i < inst._children.length; i++) {
        var el = inst._children[i]
        Polymer.dom(inst.root).appendChild(el)
      }
      return inst
    }

    _detachAndRemoveInstance (idx) {
      var inst = this._detachInstance(idx)
      if (inst) {
        this._pool.push(inst)
      }
      this.__instances.splice(idx, 1)
    }

    _stampInstance (idx) {
      var model = {}
      model[this.indexAs] = idx
      return this.stamp(model)
    }

    _insertInstance (idx) {
      var inst = this._pool.pop()
      if (!inst) {
        inst = this._stampInstance(idx)
      }
      var beforeRow = this.__instances[idx + 1]
      var beforeNode = (beforeRow && !beforeRow.isPlaceholder) ? beforeRow._children[0] : this
      var parentNode = Polymer.dom(this).parentNode
      Polymer.dom(parentNode).insertBefore(inst.root, beforeNode)
      this.__instances.push(inst)
      return inst
    }

                // Implements extension point from Templatizer mixin
    _showHideChildren (hidden) {
      for (var i = 0; i < this.__instances.length; i++) {
        this.__instances[i]._showHideChildren(hidden)
      }
    }

                // Implements extension point from Templatizer mixin
                // Called as side-effect of a host property change, responsible for
                // notifying parent path change on each inst
    _forwardParentProp (prop, value) {
      var i$ = this.__instances
      for (var i = 0, inst; (i < i$.length) && (inst = i$[i]); i++) {
        if (!inst.isPlaceholder) {
          inst.__setProperty(prop, value, true)
        }
      }
    }

                // Implements extension point from Templatizer
                // Called as side-effect of a host path change, responsible for
                // notifying parent path change on each inst
    _forwardParentPath (path, value) {
      var i$ = this.__instances
      for (var i = 0, inst; (i < i$.length) && (inst = i$[i]); i++) {
        if (!inst.isPlaceholder) {
          inst._notifyPath(path, value, true)
        }
      }
    }
            }
  customElements.define(DomRepeatN.is, DomRepeatN)
})()
