const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

const locationTemplate = document.querySelector("#locationMessage-template")
  .innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoScroll = () => {
  // const newMessage = $messages.lastElementChild;
  // const newMessageStyle = getComputedStyle(newMessage);
  // const newMessageMargin = parseInt(newMessageStyle.marginBotton);
  // const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // const visibleHeight = $messages.offsetHeight;
  // const containerHeight = $messages.scrollHeight;
  // const scrollOffset = $messages.scrollTop + visibleHeight;

  // if (containerHeight - newMessageHeight <= scrollOffset) {
  //   $messages.scrollTop = $messages.scrollHeight;
  // }

  $messages.scrollTop = $messages.scrollHeight;
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", location => {
  const html = Mustache.render(locationTemplate, {
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  if (message !== "") {
    $messageFormButton.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", message, res => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
    });
  }
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

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
