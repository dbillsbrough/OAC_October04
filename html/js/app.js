var debug = false

// local/non-prod settings
var local = false

if (local === true) {
  $('#profileList').html(`"2" value"FACTORY DEFAULTS" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)" value"(spare)"`);
}

var path = window.location.pathname;
var page = path.split("/").pop();
var systemRebootTime = 5000

var start = -9
var stop = 16
var step = 2
var signalBarArray = Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

var profileSettingCount = 10
var profileValueArr = $("#profileList").html().trim().replaceAll("value", "").split(/(?!^)".*?"/g).map(function(x) { return x.replace(/"/g, ''); })

var selectedProfileId
var currentProfileId = profileValueArr[0]
var currentProfileName = profileValueArr[profileValueArr[0]]

if (!localStorage.getItem('password')) {
  localStorage.setItem('password', '5fcf82bc15aef42cd3ec93e6d4b51c04df110cf77ee715f62f3f172ff8ed9de9')
}

if (!sessionStorage.getItem('loggedIn')) {
  sessionStorage.setItem('loggedIn', false)
}

function findSignalBarIndex(target) {
  let min;
  let chosen = 0;
  for (let i in signalBarArray) {
    min = Math.abs(signalBarArray[chosen] - target);
    if (Math.abs(signalBarArray[i] - target) < min) {
      chosen = i;
    };
  };
  return chosen;
}

function login() {

  var username = document.getElementById('username').value;
  var password = forge_sha256(document.getElementById('password').value);

  if (password === localStorage.getItem('password') && username === 'admin') {
    if (page === 'admin.html') {
      window.location.assign('admin.html');
    } else {
      window.location.assign('pages/admin.html');
    }
    sessionStorage.setItem('loggedIn', true)
  } else {
    alert('Login Failed');
  }
}

function logout() {
  sessionStorage.setItem('loggedIn', false)
  if (page === 'admin.html' || page === 'config.html') {
    window.location.assign('../index.html');
  } else {
    window.location.assign('index.html');
  }
}

function changePassBtnClick() {

  var oldPassword = forge_sha256(document.getElementById('old-password').value);
  var newPassword = document.getElementById('new-password').value;
  var repeatPassword = document.getElementById('repeat-password').value;

  if (newPassword !== "" && oldPassword === localStorage.getItem('password') && newPassword === repeatPassword) {
    localStorage.setItem('password', forge_sha256(newPassword));
    alert('Password changed');

    document.getElementById('oldpassword').value = '';
    document.getElementById('newpassword').value = '';
    document.getElementById('confirmpassword').value = '';
  } else {
    if (forge_sha256(oldPassword) !== localStorage.getItem('password')) {
      alert('Wrong Password');
    }
    if (newPassword !== repeatPassword) {
      alert('New Password Does Not Match');
    }
  }
}

function showProfileModal(id) {
  selectedProfileId = id
  $('#modalProfileName').text(profileValueArr[id]);
}

function reboot() {
  $('#rebootModal').modal("show");
  var bar = new ProgressBar.Circle(circleProgress1, {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    from: { color: '#aaa', width: 1 },
    to: { color: '#333', width: 4 },
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: systemRebootTime,
    text: {
      autoStyleContainer: false
    },
    from: {
      color: '#aaa',
      width: 4
    },
    to: {
      color: '#677ae4',
      width: 4
    },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = Math.round(circle.value() * 100);
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);

      if (value === 0) {
        circle.setText('0');
      } else if (value === 100) {
        circle.setText(value);
        window.location.assign(page);
      } else {
        circle.setText(value);
      }

    }
  });

  bar.text.style.fontSize = '2rem';
  bar.animate(1.0);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(function($) {
  'use strict';

  // dropify
  $('.dropify').dropify();

  var formPostApi = "../FORMPOST.HTM";
  var actionButtonPostApi = "../BUTTONPOST.HTM";
  var profilePostApi = "../LOADPROFILE.HTM";
  var pausePostApi = "../PAUSEPOST.HTM";

  // current profile display
  $('#currentProfile').html(`Current Profile: ${currentProfileName}`)

  // profile handling
  const restoreProfileSelect = document.querySelector("#profileSettingDropdown")

  for (var i = 1; i <= profileSettingCount; i++) {
    let aLinkSelect = `<a id="profileSettingSelect-${i}" class="dropdown-item font-weight-medium" data-toggle="modal" data-target="#loadProfileModal" onclick="showProfileModal(${i})">${profileValueArr[i]}</a>`

    restoreProfileSelect.insertAdjacentHTML("beforeend", aLinkSelect)

    if (i == currentProfileId) {
      $(`#profileSettingSelect-${i}`).addClass('profile-slected');
    }
  }

  $('#currentProfileId').val(`#${currentProfileId}`);
  $('#currentProfileName').val(currentProfileName);

  $("#submitLoadProfile").click(function(e) {

    $.post(profilePostApi, `changeProfile=${selectedProfileId}&systemReboot=${true}`).done(function() {
        console.log("submit-profile success");
      })
      .fail(function() {
        console.error(`changeprofile-post ${selectedProfileId} error`);
      })

    $('#loadProfileModal').modal("hide");
    reboot()

  });

  $("#cancelLoadProfile").click(function(e) {
    $("#loadProfileSelect").val(currentProfileId).change();
    $('#loadProfileModal').modal("hide");
  });

  // action button commands
  $("#run-button").click(function(e) {
    $.post(actionButtonPostApi, "buttonPressed=Run").done(function() {
        console.log("run-button success");
      })
      .fail(function() {
        console.error("run-button error");
      })
  });

  $("#stop-button").click(function(e) {
    $.post(actionButtonPostApi, "buttonPressed=Stop").done(function() {
        console.log("stop-button success");
      })
      .fail(function() {
        console.error("stop-button error");
      })
  });

  $("#stow-button").click(function(e) {
    $.post(actionButtonPostApi, "buttonPressed=Stow").done(function() {
        console.log("stow-button success");
      })
      .fail(function() {
        console.error("stow-button error");
      })
  });

  $("#tracstar-functions button").click(function(e) {
    $('#tracstar-functions .active').removeClass('active');
  });

  // system pause handling
  $("#SystemPauseModalBtn").click(function(e) {
    $('#systemPauseModal').modal("show");
  });

  $("#systemPause").click(function(e) {
    $('#systemPauseModal').modal("hide");
    $.post(pausePostApi, "buttonPaused=True, systemReboot=True").done(function() {
        console.log("run-button success");
      })
      .fail(function() {
        console.error("run-button error");
      })
    reboot()
  });

  $("#cancelSystemPause").click(function(e) {
    $('#systemPauseModal').modal("hide");
  });

  $("#exportProfileBtn").click(function(e) {
    var json = JSON.stringify($("#modemSettings").serializeArray());
    var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    var filename = `${currentProfileId}-${currentProfileName}-${new Date().toJSON().slice(0,10)}.json`;

    var isIE = false || !!document.documentMode;
    if (isIE) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = $('<a id="tempDownload" />');
      a.attr('download', filename);
      a.attr('href', link);
      $("body").append(a);
      a[0].click();
      $("#tempDownload").remove;
    }
  });

  $("#importProfileBtn").click(function(e) {
    var myFile = $('#importProfileFile').prop('files')[0];
    var fr = new FileReader();
    var __clone = $("form").clone();
    fr.onload = function() {
      var jsonImportData = JSON.parse(fr.result);
      const processFileImportData = async () => {
        await asyncForEach(jsonImportData, async (item, i) => {
          $(`#${item.name}`).val(item.value)
        });

        if ($("form").serialize() != $(__clone).serialize()) {
          $('#saveNotification').removeAttr("hidden");
        } else {
          $('#saveNotification').attr("hidden");
        }
      }
      processFileImportData()
    };
    fr.readAsText(myFile);
  });

  $('#importProfileFile').change(
    function() {
      $('#importProfileBtn').attr('disabled', ($(this).val() ? false : true));
    }
  );

  // auth handling
  if (sessionStorage.getItem('loggedIn') === 'true') {
    $("#admin-profile").show();
    $(".admin-nav-link").show();
    $("#login-button").hide();
  } else {
    $("#admin-profile").hide();
    $(".admin-nav-link").hide();
    $("#login-button").show();
  }

  // websocket
  var ws = local === true ? new WebSocket("ws://127.0.0.1:8080/ws") : new WebSocket("ws://" + window.location.hostname + "/ws");

  ws.onopen = function(event) {
    ws.send("Here's some text that the server is urgently awaiting!");
  };

  ws.onmessage = function(event) {
    var statusJSON = JSON.parse(event.data)

    if (debug) {
      console.log(event);
      console.log(`clinet recieved: ${event.data}`);
      console.log(`Message Object: parsed`);
      console.log(statusJSON);
    }

    if ('IDD' in statusJSON.status) {
      $('#display-1').val(statusJSON.status.IDD.substring(0, 16))
      $('#display-2').val(statusJSON.status.IDD.substring(17, 33))
      ws.send("exchData->snr");
      if (debug) {
        console.log(`Message Object | IDD | ${statusJSON.status.IDD}`);
        console.log(`Message object | IDD | Line 1 00-16 chars | ${statusJSON.status.IDD.substring(0, 16)}`);
        console.log(`Message object | IDD | Line 2 17-33 chars | ${statusJSON.status.IDD.substring(17, 33)}`);
        console.log('Reply to WSS | IDD Message Recieved and Display Updated');
        ws.send("IDD Message Recieved and Display Updated");
      }
    }

    if ('SNR' in statusJSON.status) {

      $('#signal-strength-value').html(statusJSON.status.SNR)
      $('.br-theme-bars-square .br-widget a').css('border-color', 'rgba(245, 166, 35, 0.6)')

      if (debug) {
        console.log(`Message object | SNR | ${statusJSON.status.SNR}`);
      }

      if (statusJSON.status.SNR >= -9) {
        $('.br-theme-bars-square .br-widget a').css('background-color', 'lightgreen')
        $('select').barrating('set', +findSignalBarIndex(statusJSON.status.SNR) + 1);
        $('.br-theme-bars-square .br-widget a.br-active, .br-theme-bars-square .br-widget a.br-selected').css('background-color', 'green')
        $('.br-theme-bars-square .br-widget a.br-active, .br-theme-bars-square .br-widget a.br-selected').css('border-color', 'green')
      } else {
        $('.br-theme-bars-square .br-widget a').css('background-color', 'red')
        $('select').barrating('set', 0);
      }
    }

    if ('ANT' in statusJSON.status) {
      statusJSON.status.ANT == 1 ? $('#antenna-status').css('background-color', 'green') : $('#antenna-status').css('background-color', 'red')

      if (debug) {
        console.log(`Message object | ANT | ${statusJSON.status.ANT}`);
      }

    }

    if ('MOD' in statusJSON.status) {
      statusJSON.status.MOD == 1 ? $('#modem-status').css('background-color', 'green') : $('#modem-status').css('background-color', 'red')

      if (debug) {
        console.log(`Message object | MOD | ${statusJSON.status.MOD}`);
      }

    }

  }

})(jQuery);
