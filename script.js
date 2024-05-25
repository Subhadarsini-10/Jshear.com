document.addEventListener("DOMContentLoaded", () => {
  const devicesContainer = document.getElementById("hearing-aids");
  const deviceName = document.getElementById("device-name");
  const deviceDescription = document.getElementById("device-description");
  const deviceImage = document.getElementById("device-image");
  const containerContent = document.getElementById("container-content");
  let devices = [];
  let currentIndex = 0;

  // Function to render devices based on screen width
  function renderDevices() {
    const isSmallDevice = window.matchMedia("(max-width: 992px)").matches;

    devicesContainer.innerHTML = ""; // Clear existing content

    devices.forEach((device, index) => {
      const deviceElement = document.createElement("div");
      deviceElement.classList.add("device");

      if (isSmallDevice) {
        // For small devices, show only "AX RIC-R" part of the name
        deviceElement.textContent = device.name.split(" ").slice(2).join(" ");
      } else {
        // For large devices, make "hear.com" bold
        const boldPart = "hear.com";
        const nameParts = device.name.split(boldPart);
        deviceElement.innerHTML = `${nameParts[0]}<b class="bold">${boldPart}</b>${nameParts[1]}`;
        console.log(
          `${nameParts[0]}<b class="bold">${boldPart}</b>${nameParts[1]}`
        );
      }

      deviceElement.addEventListener("click", () => selectDevice(index));
      deviceElement.addEventListener("mouseenter", () =>
        deviceElement.classList.add("hovered")
      );
      deviceElement.addEventListener("mouseleave", () =>
        deviceElement.classList.remove("hovered")
      );
      devicesContainer.appendChild(deviceElement);
    });
  }

  // Other functions remain the same...

  function selectDevice(index) {
    const prevActiveDevice = document.querySelector(".device.active");
    if (prevActiveDevice) {
      prevActiveDevice.classList.remove("active");
    }

    // Add active class to the selected device
    const selectedDevice = devicesContainer.children[index];
    selectedDevice.classList.add("active");

    currentIndex = index;
    updateHeader(index);
    updateUrlParameter(devices[index].key);
  }

  // Function to update header with device details
  function updateHeader(index) {
    const device = devices[index];
    const boldPart = "hear.com";

    // Use replace with a regular expression to wrap "hear.com" with <b> tag
    const modifiedName = device.name.replace(
      new RegExp(boldPart, "g"),
      `<b class="bold">${boldPart}</b>`
    );

    // Set the modified name as the text content of deviceName
    deviceName.innerHTML = modifiedName;

    // Set other device details
    deviceImage.src = device.image;
    deviceImage.alt = device.name;
  }

  // Function to update URL parameter
  function updateUrlParameter(key) {
    const url = new URL(window.location);
    url.searchParams.set("aud_device", key);
    window.history.pushState({}, "", url);
  }

  // Function to check URL parameter and select corresponding device
  function checkUrlParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const audDevice = urlParams.get("aud_device");
    if (audDevice) {
      const deviceIndex = devices.findIndex(
        (device) => device.key === audDevice
      );
      if (deviceIndex !== -1) {
        selectDevice(deviceIndex);
      }
    }
  }

  // Function to update container content
  function updateContainerContent(text) {
    containerContent.textContent = text;
  }

  // Event listener for keydown event to handle navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % devices.length;
      selectDevice(currentIndex);
    } else if (event.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + devices.length) % devices.length;
      selectDevice(currentIndex);
    }
  });

  // Event listener for resize event to update device names based on screen width
  window.addEventListener("resize", renderDevices);

  // Fetch hearing aids data and initialize the page
  fetch("hearingAids.json")
    .then((response) => response.json())
    .then((data) => {
      devices = data;
      renderDevices();
      checkUrlParameter();
      updateContainerContent("The right model for every requirement.");
      updateHeader(currentIndex); // Update header with initial device details
    });
});
