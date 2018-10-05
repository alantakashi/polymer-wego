/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js'
import '@polymer/iron-ajax/iron-ajax.js'
import '@polymer/iron-list/iron-list.js'
import './shared-styles.js'

class MainView extends PolymerElement {
  static get template () {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
        .hotels-listing {
          width: 100%;
        }

        .hotels-listing .hotel {
          width: 100vw !important;
          height: 100vh !important;
        }

        .hotel {
          display: flex;
          flex-direction: row;
          background-color: #fff;
          border-top: 1px solid #fff;
          border-right: 1px solid #ddd;
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }

        .hotel-image {
          width: 120px;
          height: 120px;
        }

        .hotel-image img {
          display: block;
          width: 100%;
        }

        .hotel-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 8px;
          line-height: 18px;
        }

        .hotel-name {
          font-size: 16px;
          font-weight: 500;
        }

        .hotel-meta {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 12px;
          color: #555;
        }

        .star-wrapper {
          display: flex;
          flex-direction: row;
          margin-right: 8px;
        }

        .star-wrapper .star {
          display: block;
          background: url(https://assets.wego.com/image/upload/kabru/hstar.png) no-repeat;
          background-size: contain;
          width: 12px;
          height: 12px;
        }

        .hotel-distance {
          font-size: 12px;
          color: #555;
        }

        .hotel-review {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          flex-grow: 1;
          padding-top: 12px;
        }

        .hotel-review .hotel-score {
          background-image: url(https://assets.wego.com/image/sprite/reviewscore);
          background-size: cover;
          background-repeat: no-repeat;
          width: 26px;
          height: 30px;
          font-size: 14px;
          font-weight: 300;
          color: #fff;
          text-align: center;
          line-height: 26px;
        }

        .hotel-review .hotel-score.poor {
          background-position: 0 -60px;
        }
        .hotel-review .hotel-score.fair {
          background-position: 0 -30px;
        }
        .hotel-review .hotel-score.good,
        .hotel-review .hotel-score.very.good,
        .hotel-review .hotel-score.excellent {
          background-position: 0 0;
        }

        .hotel-review .hotel-score-ref {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 0 8px;
          font-size: 14px;
          text-transform: capitalize;
        }

        .hotel-review .hotel-score-ref span {
          font-size: 10px;
        }

        .hotel-review .hotel-amount {
          font-size: 18px;
          font-weight: 500;
          color: #5a9626;
        }

        .hotel-review .hotel-amount sup {
          margin: 4px;
          font-weight: normal;
        }
      </style>

      <iron-ajax url="http://127.0.0.1:8089/hotels" last-response="{{hotels}}" auto></iron-ajax>
      <iron-list items="[[hotels]]" as="item">
        <template>
          <div class="hotel">
            <div class="hotel-image">
              <img src=[[item.image]] />
            </div>
            <div class="hotel-info">
              <div class="hotel-name">[[item.name]]</div>
              <div class="hotel-meta">
                <div class="hotel-rating">
                  <div class="star-wrapper" inner-h-t-m-l="[[ _renderStar(item.stars) ]]"></div>
                </div>
                <div class="hotel-district">[[item.district]]</div>
              </div>
              <div class="hotel-distance">{{_renderDistance(item.distanceToCityCentre)}} km to city centre</div>
              <div class="hotel-review">
                <div class$="hotel-score {{_getReviewClass(item.review.score)}}">[[item.review.score]]</div>
                <div class="hotel-score-ref">[[_getReviewClass(item.review.score)]] <span>[[item.review.reviewsCount]] Reviews</span></div>
                <div class="hotel-amount"><sup>S$</sup>[[item.amount]]</div>
              </div>
            </div>
          </div>
        </template>
      </iron-list>
    `
  }

  _renderDistance (disntance) {
    return (disntance / 10).toFixed(2)
  }

  _renderStar (star) {
    let stars = ''
    for (var i = 1; i <= star; i++) {
      stars += '<span class="star"></span>'
    }

    return stars
  }

  _getReviewClass (score) {
    if (score === 0 && score <= 67) {
      return 'poor'
    } else if (score > 67 && score <= 74) {
      return 'fair'
    } else if (score > 74 && score <= 79) {
      return 'good'
    } else if (score > 79 || score <= 85) {
      return 'very good'
    } else {
      return 'excellent'
    }
  }
}

window.customElements.define('main-view', MainView)
