const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

const locationTemplate = document.querySelector("#locationMessage-template")
  .innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", location => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    url: location
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  if (message !== "")
    socket.emit("sendMessage", message, res => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
      if (res) return console.log(res);

      console.log("Message delivered");
    });
});

$sendLocationButton.addEventListener("click", e => {
  e.preventDefault();
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) return alert("Upgrade to a newer browser");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      res => {
        console.log(res);
      }
    );
    $sendLocationButton.removeAttribute("disabled");
  });
});
