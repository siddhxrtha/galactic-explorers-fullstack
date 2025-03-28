// Title gets typed out here using "typeWriter" Function
document.addEventListener("DOMContentLoaded", function() {
  const text = "Stay Fit, Explore Rare Planets, Forge Guilds, Shop the Marketplace, and Unleash the Fun!";
  const speed = 35; 
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      document.getElementById("welcome-text-subtitle").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
});