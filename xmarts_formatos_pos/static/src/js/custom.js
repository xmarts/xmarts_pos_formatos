odoo.define('xmarts_formatos_pos.custom', function (require) {
"use strict";

var gui = require('point_of_sale.gui');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;

screens.ReceiptScreenWidget.include({
    show: function(){
        this._super();
        var self = this;

        this.render_change();
        this.render_receipt();
        this.handle_auto_print();
        this.render_receipt_dos();
        $('.pos-receipt-container-dos').show();
        $('.pos-receipt-container').show();
    },
    render_receipt_dos: function() {
        this.$('.pos-receipt-container-dos').html(QWeb.render('PosTicket_dos', this.get_receipt_render_env()));
    },
    print_format: function() {
    var self = this;
       
        $('.pos-receipt-container-dos').show();
        $('.pos-receipt-container').hide();
         window.print();
    },
     print: function() {
        var self = this;

        if (!this.pos.config.iface_print_via_proxy) { // browser (html) printing

            // The problem is that in chrome the print() is asynchronous and doesn't
            // execute until all rpc are finished. So it conflicts with the rpc used
            // to send the orders to the backend, and the user is able to go to the next 
            // screen before the printing dialog is opened. The problem is that what's 
            // printed is whatever is in the page when the dialog is opened and not when it's called,
            // and so you end up printing the product list instead of the receipt... 
            //
            // Fixing this would need a re-architecturing
            // of the code to postpone sending of orders after printing.
            //
            // But since the print dialog also blocks the other asynchronous calls, the
            // button enabling in the setTimeout() is blocked until the printing dialog is 
            // closed. But the timeout has to be big enough or else it doesn't work
            // 1 seconds is the same as the default timeout for sending orders and so the dialog
            // should have appeared before the timeout... so yeah that's not ultra reliable. 

            this.lock_screen(true);

            setTimeout(function(){
                self.lock_screen(false);
            }, 1000);
            $('.pos-receipt-container-dos').hide();
            $('.pos-receipt-container').show();
            this.print_web();
        } else {    // proxy (xml) printing
            this.print_xml();
            this.lock_screen(false);
        }
    },
    renderElement: function() {
        var self = this;
        this._super();
        this.$('.next').click(function(){
            if (!self._locked) {
                self.click_next();
            }
        });
        this.$('.back').click(function(){
            if (!self._locked) {
                self.click_back();
            }
        });
        this.$('.button.print').click(function(){
            if (!self._locked) {
                self.print();
            }
        });
        this.$('.button.print_format').click(function(){
            if (!self._locked) {
                self.print_format();
            }
        });
        var button_print_invoice = this.$('.button.print_invoice');
        button_print_invoice.click(function () {
            var order = self.pos.get_order();
            var invoiced = self.pos.push_and_invoice_order(order);
            self.invoicing = true;

            invoiced.fail(self._handleFailedPushForInvoice.bind(self, order, true)); // refresh

            invoiced.done(function(){
                self.invoicing = false;
                self.gui.show_screen('receipt', {button_print_invoice: false}, true); // refresh
            });
        });

    },
});

});