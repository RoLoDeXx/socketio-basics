const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#sendLocation");

socket.on("message", welcomeMessage => {
  console.log(welcomeMessage);
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
document.get;

$sendLocationButton.addEventListener("click", () => {
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

socket.on("sendMessage", text => {
  console.log(text);
});
