(function($) {
  'use strict';

  $.validator.setDefaults({
    // submitHandler: function() {
    //   reboot();
    // }
  });
  $.validator.addMethod('IP4Checker', function(value) {
    return value.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
  }, 'Invalid IP address');

  $.validator.addMethod("twoDecimals", function(value, element) {
    return this.optional(element) || /^\d{0,4}(\.\d{0,2})?$/i.test(value);
  }, "You must have a percision of two decimal places");

  var __clone = $("form").clone();

  $("form")
    .on("input", function() {
      if ($("form").serialize() != $(__clone).serialize()) {
        $('#saveNotification').removeAttr("hidden");
      } else {
        $('#saveNotification').attr("hidden");
      }
    });

  $(function() {
    $("#modemSettings").validate({
      rules: {
        modemip: {
          required: true,
          IP4Checker: true
        },
        modemport: {
          required: true,
          number: true,
          range: [1024, 49151],
        },
        modemroot: {
          required: true,
          minlength: 2
        },
        modemuser: {
          required: true,
          minlength: 5
        },
        modempass: "required",
        modemsat: {
          required: true,
          number: true,
          range: [-360, 360.99],
          twoDecimals: true
        },
        vscan: {
          required: true,
          number: true,
          range: [0.00, 9.99],
          twoDecimals: true
        },
        trackgain: {
          required: true,
          number: true,
          range: [0, 9999]
        },
        stepadjust: {
          required: true,
          number: true,
          range: [0, 99]
        },
        stepignore: {
          required: true,
          number: true,
          range: [0, 99]
        },
        lockthresh: {
          required: true,
          number: true,
          range: [-9.99, 9.99],
          twoDecimals: true
        },
        snrhigh: {
          required: true,
          number: true,
          range: [-9.99, 9.99],
          twoDecimals: true
        },
        snrmin: {
          required: true,
          number: true,
          range: [-9.99, 9.99],
          twoDecimals: true
        },
        profilename: {
          alphanumeric: true
        }
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      },
      submitHandler: function(form, e) {
        e.preventDefault();
        if (debug === true) console.log('modemSettings form submitted');
        $.ajax({
          type: 'POST',
          url: '../FORMADMIN.HTM',
          data: $('#modemSettings').serialize(),
          success: function(result) {
            reboot()
          },
          error: function(error) {
            console.error(error);
          }
        });
        return false;
      }
    });
  });

  $(function() {
    $("#deviceNetwork").validate({
      rules: {
        oacip: {
          required: true,
          IP4Checker: true
        },
        devicenetmask: "required",
        devicegateway: {
          required: true,
          IP4Checker: true
        },
        devicedns: {
          required: true,
          IP4Checker: true
        }
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      },
      submitHandler: function(form, e) {
        e.preventDefault();
        if (debug === true) console.log('deviceNetwork form submitted');
        $.ajax({
          type: 'POST',
          url: '../FORMPOST.HTM',
          data: $('#deviceNetwork').serialize(),
          success: function(result) {
            reboot()
          },
          error: function(error) {
            console.error(error);
          }
        });
        return false;
      }
    });
  });

  $(function() {
    $("#changePassowrd").validate({
      rules: {
        oldpassword: {
          required: true,
          minlength: 2
        },
        newpassword: {
          required: true,
          minlength: 5
        },
        confirmpassword: {
          required: true,
          minlength: 5,
          equalTo: "#newpassword"
        },
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      },
      submitHandler: function(form, e) {
        e.preventDefault();
        if (debug === true) console.log('changePassowrd form submitted');
        $.ajax({
          type: 'POST',
          url: '../FORMPOST.HTM',
          data: $('#changePassword').serialize(),
          success: function(result) {
            reboot()
          },
          error: function(error) {
            console.error(error);
          }
        });
        return false;
      }
    });
  });

  $(function() {
    $("#updateFirmware").validate({
      rules: {
        updateFirmwareFile: "required"
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      },
      submitHandler: function(form, e) {
        e.preventDefault();
        if (debug === true) console.log('changePassowrd form submitted');
        $.ajax({
          type: 'POST',
          url: '../FILEPOST.HTM',
          data: $('#updateFirmware').serialize(),
          success: function(result) {
            reboot()
          },
          error: function(error) {
            console.error(error);
          }
        });
        return false;
      }
    });
  });
})(jQuery);
