/**
 * Copyright © 2019 Paazl. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'uiComponent',
    'jquery',
    'domReady',
    'Magento_Checkout/js/model/shipping-save-processor',
    'Magento_Checkout/js/model/quote'
], function (ko, Component, $, domReady, shippingSaveProcessor, quote) {
    'use strict';

    const paazlCheckoutUrl = 'https://api-acc.paazl.com/v1/checkout';

    var shippingConfig = window.checkoutConfig.paazlshipping || {};
    var widgetConfig = shippingConfig.widgetConfig || {};

    domReady(function () {
        /**
         * Preventing propagation of click event in order to avoid send of Shipping form
         */
        $(document).on('click', "#widget_paazlshipping_paazlshipping button", function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    });

    return Component.extend({
        configJson: ko.observable(),
        widgetLoaded: false,
        customerAddressId: null,
        state: {
            postcode: null,
            country: null
        },

        initialize: function () {
            this._super();
            this.getConfigJson(widgetConfig);

            if (shippingConfig.googleMapKey) {
                (function (i, s, o, g, r, a, m) {
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(
                    window,
                    document,
                    'script',
                    '//maps.googleapis.com/maps/api/js?key=' + shippingConfig.googleMapKey
                );
            }
        },

        getConfigJson: function (data) {
            this.configJson(data);
        },

        isHideOtherMethods: function () {
            return shippingConfig.hideOtherMethods;
        },

        getCarrierCode: function () {
            return shippingConfig.carrierCode;
        },

        getMethodCode: function () {
            return shippingConfig.methodCode;
        },

        /**
         *
         * @return {string}
         */
        getJsName: function () {
            var name = 'checkoutjs';
            if (shippingConfig.mode === 'test') {
                name += '_test';
            } else {
                name += '_live';
            }

            return name;
        },

        loadWidget: function (postcode, country) {
            var data = this.configJson(),
                self = this;

            if (!data) {
                return;
            }
            var container = $('#' + data.mountElementId);

            if (!container.length) {
                return;
            }

            var infoUpdate = function (paazlCheckout) {
                if (!container.data('paazlactive')) {
                    data.consigneePostalCode = postcode || data.consigneePostalCode;
                    data.consigneeCountryCode = country || data.consigneeCountryCode;
                    paazlCheckout.init(data);
                    container.data('paazlactive', true);
                    self.state.postcode = data.consigneePostalCode;
                    self.state.country = data.consigneeCountryCode;
                } else {
                    if (postcode != '' && (postcode != self.state.postcode)) {
                        paazlCheckout.setConsigneePostalCode(postcode);
                        self.state.postcode = postcode;
                    }

                    if (country != '' && (country != self.state.country)) {
                        paazlCheckout.setConsigneeCountryCode(country);
                        self.state.country = country;
                    }
                }
            };

            let open = window.XMLHttpRequest.prototype.open,
                onloadend;

            window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                if (url === paazlCheckoutUrl) {
                    if(this.onloadend) {
                        onloadend = this.onloadend;
                    }
                    this.onloadend = onLoadEnd;
                }

                return open.apply(this, arguments);
            };

            function onLoadEnd() {
                let ready = this.readyState === 4 || false;

                if (self.widgetLoaded && ready) {
                    let shippingMethod = quote.shippingMethod();

                    if (shippingMethod && shippingMethod['method_code']) {
                        shippingSaveProcessor.saveShippingInformation();
                    }
                }

                if(onloadend) {
                    return onloadend.apply(this, arguments);
                }
            }

            self.widgetLoaded = true;
            self.customerAddressId = quote.shippingAddress()['customerAddressId'];

            require([this.getJsName()], infoUpdate);
        }
    });
}
);
