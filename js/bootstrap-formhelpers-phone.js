/* ==========================================================
 * bootstrap-formhelpers-phone.js v1.2.0
 * https://github.com/vlamanna/BootstrapFormHelpers
 * ==========================================================
 * Copyright 2012 Vincent Lamanna
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
 
 !function ($) {

  "use strict"; // jshint ;_;


 /* PHONE CLASS DEFINITION
  * ====================== */

  var Phone = function (element, options) {
    this.options = $.extend({}, $.fn.phone.defaults, options)
    this.$element = $(element)
    if (this.$element.is("input:text")) {
      this.$element.on('propertychange.phone.data-api change.phone.data-api input.phone.data-api paste.phone.data-api', {phoneObject: this}, this.change)
      
      var country = this.options.country
      
      var formObject = this.$element.closest('form')
      
      if (country != "") {
		var countryObject = formObject.find('#' + country)
		
		if (countryObject.length != 0) {
		  this.options.format = PhoneFormatList[countryObject.val()]
		  countryObject.on('change.phone.data-api', {phoneObject: this}, this.changeCountry)
		} else {
		  this.options.format = PhoneFormatList[country]
		}
	  }
      
      this.addFormatter()
    }
    
    if (this.$element.is("span")) {
      this.displayFormatter()
    }
  }

  Phone.prototype = {

    constructor: Phone

  , getFormattedNumber: function() {
    var format = this.options.format
    var phoneNumber = new String(this.options.number)
    var formattedNumber = ""
    
    var j = 0
    for (var i = 0; i < format.length; i++) {
      if (/[0-9]/.test(format.charAt(i))) {
        if (format.charAt(i) == phoneNumber.charAt(j)) {
          formattedNumber += phoneNumber.charAt(j)
          j++
        } else {
          formattedNumber += format.charAt(i)
        }
      } else if (format.charAt(i) != "d") {
        formattedNumber += format.charAt(i)
      } else {
        if (phoneNumber.charAt(j) == "") {
          formattedNumber += " "
        } else {
          formattedNumber += phoneNumber.charAt(j)
          j++
        }
      }
    }
    
    return formattedNumber
  }
  
  , addFormatter: function () {
    var formattedNumber = this.getFormattedNumber()
    
    this.$element.val(formattedNumber)
  }
  
  , displayFormatter: function () {
    var formattedNumber = this.getFormattedNumber()
    
    this.$element.html(formattedNumber)
  }
  
  , changeCountry: function (e) {
      var $this = $(this)
      var phoneObject = e.data.phoneObject
      
      phoneObject.options.format = PhoneFormatList[$this.val()]
      
      phoneObject.addFormatter()
  }
  
  , change: function(e) {
    var $this
    
    $this = e.data.phoneObject
    
    if ($this.$element.is('.disabled, :disabled')) return
    
    var number = $this.$element.val()
    var newNumber = ""
    for (var i = 0; i < number.length; i++) {
      if (/[0-9]/.test(number.charAt(i))) {
        newNumber += number.charAt(i)
      }
    }
    
    $this.options.number = newNumber
    
    $this.addFormatter()
    
    $this.$element.data('number', $this.options.number)
  }

  }


 /* PHONE PLUGIN DEFINITION
  * ======================= */

  $.fn.phone = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('phone')
        , options = typeof option == 'object' && option
      if (!data) $this.data('phone', (data = new Phone(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.phone.Constructor = Phone

  $.fn.phone.defaults = {
    format: "",
    number: "",
    country: ""
  }


 /* PHONE DATA-API
  * ============== */

  $(window).on('load', function () {
    $('form input:text.phone, span.phone').each(function () {
      var $phone = $(this)

      $phone.phone($phone.data())
    })
  })

}(window.jQuery);