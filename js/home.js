/* Home page banner: shows the live date/time and scrolls it across the screen. */

const welcome = document.getElementById('movingMessage');

// Update the welcome text with the current date and time, every second.
function updateWelcome() {
  const now = new Date();
  const dateText = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeText = now.toLocaleTimeString('en-GB');
  welcome.textContent = 'Welcome to the Masari website! Today is ' + dateText + ', and the time is ' + timeText + '.';
}
updateWelcome();
setInterval(updateWelcome, 1000);

// Simple scrolling banner: move the text left using its position each frame,
// then jump back to the right once it is fully off-screen. This avoids any
// custom CSS by setting the position directly from JavaScript.
let bannerPosition = 300;
function scrollWelcome() {
  const box = welcome.parentElement;
  bannerPosition -= 2;
  if (bannerPosition < -welcome.scrollWidth) {
    bannerPosition = box.clientWidth;
  }
  welcome.style.position = 'relative';
  welcome.style.left = bannerPosition + 'px';
}
setInterval(scrollWelcome, 30);
