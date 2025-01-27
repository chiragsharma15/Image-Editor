const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".slider .value"),
  filterSlider = document.querySelector(".slider input"),
  roateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  saveImgBtn = document.querySelector(".save-img"),
  chooseImgBtn = document.querySelector(".choose-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0]; // getting user selected file
  if (!file) return; // return if no file is selected
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

roateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    // Set canvas size to match the image
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
  
    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center of the canvas
  
    if (rotate !== 0) {
      ctx.rotate((rotate * Math.PI) / 180); // Apply rotation
    }
  
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1); // Apply flipping
  
    ctx.translate(-canvas.width / 2, -canvas.height / 2); // Move back to the origin
  
    // Apply filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  
    // Draw the image
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
  
    // Convert canvas to image and download
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  };
  

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => {
  fileInput.click();
});
