// Function to detect URL change
function monitorUrlChange() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log("URL changed to", currentUrl);
      window.location.reload();
    }
  }).observe(document, { subtree: true, childList: true });
}

// Call the function to start monitoring URL changes
monitorUrlChange();
function fetchSidebarContent(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  });
}

// function loadSidebarContent(sidebarDiv) {
//   const url = chrome.runtime.getURL("sidebar.html");
//   fetchSidebarContent(url)
//     .then((data) => {
//       sidebarDiv.innerHTML = data;
//       handleTabSwitching();
//       handleAccordion();
//       setImageSources();
//       setupLoginButton();
//       setProductImage();
//       setProductPrice();
//       setProductTitle();
//       setRatingAndReviews();
//       addEventListenersToButtons();
//       handleNextData();
//     })
//     .catch((error) => console.error("Error loading sidebar content:", error));
// }

function handleTabSwitching() {
  const tabs = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(tab.getAttribute("data-tab"));
      targetPanel.classList.add("active");
    });
  });
}

function handleAccordion() {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const toggleButton = item.querySelector(".accordion-toggle");
    const content = item.querySelector(".accordion-content");

    toggleButton.addEventListener("click", function () {
      const isOpen = item.classList.toggle("open");
      toggleButton.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        content.style.display = "block";
        toggleButton.querySelector(".arrow").innerHTML = "&#128897;";
      } else {
        content.style.display = "none";
        toggleButton.querySelector(".arrow").innerHTML = "&#128899;";
      }
    });

    if (item.classList.contains("open")) {
      content.style.display = "block";
      toggleButton.querySelector(".arrow").innerHTML = "&#128897;";
    }
  });
}

function setImageSources() {
  const imageMappings = [
    { id: "logoImage", src: "images/WAP_Circle_Logo.png" },
    // { id: "contentLogoImage", src: "images/logo.png" },
    { id: "contentLogoImage", src: "images/WAP_Circle_Logo.png" },
    { id: "downloadImage", src: "images/download.png" },
    { id: "downloadImage2", src: "images/download.png" },
    { id: "settingImage", src: "images/setting.png" },
    { id: "logoutImage", src: "images/logout.png" },
    { id: "googleBtntImage", src: "images/googleLogo.png" },
    { id: "amazonBtnImage", src: "images/amazonLogo.png" },
    { id: "ebayBtnImage", src: "images/ebayLogo.png" },
    { id: "starImage", src: "images/star.png" },
    { id: "leftArrowImage", src: "images/leftArrow.png" },
  ];

  imageMappings.forEach(({ id, src }) => {
    const imgElement = document.getElementById(id);
    if (imgElement) {
      imgElement.src = chrome.runtime.getURL(src);
    }
  });
}

function setupLoginButton() {
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      const currentUrl = window.location.href;
      if (currentUrl.startsWith("https://www.walmart.com/ip/")) {
        document.getElementById("logoDiv").classList.add("hidden");
        document.getElementById("contentDiv").classList.remove("hidden");
      } else {
        document.getElementById("logoDiv").classList.add("hidden");
        document.getElementById("noData").classList.remove("hidden");
      }
    });
  }
}

function setProductImage() {
  const mediaThumbnail = document.querySelector(
    '[data-testid="media-thumbnail"] img'
  );
  const productImage = document.getElementById("productImage");
  if (mediaThumbnail && productImage) {
    productImage.src = mediaThumbnail.src;
  }
}

function setProductPrice() {
  const priceElement = document.querySelector(
    '[data-testid="price-wrap"] span[itemprop="price"]'
  );
  const productPrice = document.getElementById("productPrice");
  if (priceElement && productPrice) {
    const priceText = priceElement.textContent.replace("Now", "").trim();
    productPrice.textContent = priceText;
  }
}

function setProductTitle() {
  const mainTitle = document.getElementById("main-title");
  const productTitle = document.getElementById("productTitle");
  if (mainTitle && productTitle) {
    let titleText = mainTitle.textContent.trim();
    const maxLength = 150;
    if (titleText.length > maxLength) {
      titleText = titleText.substring(0, maxLength) + "...";
    }
    productTitle.textContent = titleText;
  }
}

function handleProductTitleClick() {
  const productTitleToggle =
    localStorage.getItem("productTitleToggle") === "true";
  if (productTitleToggle) {
    const productTitle = document.getElementById("productTitle");
    if (productTitle) {
      const titleText = productTitle.textContent.trim();

      // Attempt to copy text to clipboard
      navigator.clipboard
        .writeText(titleText)
        .then(() => {
          // Show tooltip
          const tooltip = document.createElement("div");
          tooltip.textContent = "Copied";
          tooltip.className = "tooltip";
          productTitle.appendChild(tooltip);

          // Hide tooltip after 2 seconds
          setTimeout(() => {
            tooltip.remove();
          }, 1000);
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    }
  }
}

function setRatingAndReviews() {
  const ratingElement = document.querySelector(".rating-number");
  const reviewElement = document.querySelector('[itemprop="ratingCount"]');
  const ratingValue = document.getElementById("ratingValue");
  const reviewCount = document.getElementById("reviewCount");

  if (ratingElement && ratingValue) {
    const cleanedRating = ratingElement.textContent.trim().replace(/[()]/g, "");
    ratingValue.textContent = `${cleanedRating}/5`;
  }

  if (reviewElement && reviewCount) {
    reviewCount.textContent = `(${reviewElement.textContent.trim()})`;
  }
}

function handleItemIdClick() {
  const itemIdToggle = localStorage.getItem("itemIdToggle") === "true";
  if (itemIdToggle) {
    const itemId = document.getElementById("itemId");
    if (itemId) {
      const itemIdText = itemId.textContent.trim();

      // Attempt to copy text to clipboard
      navigator.clipboard
        .writeText(itemIdText)
        .then(() => {
          // Show tooltip
          const tooltip = document.createElement("div");
          tooltip.textContent = "Copied";
          tooltip.className = "tooltip";
          itemId.appendChild(tooltip);

          // Hide tooltip after 2 seconds
          setTimeout(() => {
            tooltip.remove();
          }, 2000);
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    }
  }
}

function handleUpcIdClick() {
  const upcToggle = localStorage.getItem("upcToggle") === "true";
  if (upcToggle) {
    const upcId = document.getElementById("upcId");
    if (upcId) {
      const upcIdText = upcId.textContent.trim();

      // Attempt to copy text to clipboard
      navigator.clipboard
        .writeText(upcIdText)
        .then(() => {
          // Show tooltip
          const tooltip = document.createElement("div");
          tooltip.textContent = "Copied";
          tooltip.className = "tooltip";
          upcId.appendChild(tooltip);

          // Hide tooltip after 2 seconds
          setTimeout(() => {
            tooltip.remove();
          }, 2000);
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    }
  }
}

function openSearchResult(baseUrl) {
  // Retrieve search preference from local storage
  const searchPreference = localStorage.getItem("searchPreference");

  // Determine the search query based on the preference
  let searchQuery;
  if (searchPreference === "upc") {
    searchQuery = localStorage.getItem("upc") || ""; // Retrieve UPC from local storage
  } else {
    // Default to product title
    searchQuery = document.getElementById("productTitle").textContent.trim();
  }

  // Construct the full search URL
  const searchUrl = baseUrl + encodeURIComponent(searchQuery);

  // Open the search URL in a new tab
  window.open(searchUrl, "_blank");
}

//seller export function
function downloadSellersDataAsCSV() {
  // Select the table
  const table = document.querySelector(".seller-info-table");

  let csvContent = "data:text/csv;charset=utf-8,";

  // Extract headers
  const headers = table.querySelectorAll("th");
  const headerRow = Array.from(headers)
    .map((header) => `"${header.innerText}"`)
    .join(",");
  csvContent += headerRow + "\r\n";

  // Extract rows
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowContent = Array.from(cells)
      .map((cell) => `"${cell.innerText}"`)
      .join(",");
    csvContent += rowContent + "\r\n";
  });
  createDownloadFile(csvContent, "Seller Export");
}

//product data export function
function downloadProductDataAsCSV() {
  //create a table with the following headers

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "Product URL,Walmart URL,UPC,Cost Price,Sale Price,Referral Fees,Fulfillment Fees,Profit,ROI,Est. Sales\r\n";

  // Extract product data
  const allData = JSON.parse(
    document.getElementById("__NEXT_DATA__").textContent
  );
  // console.log(allData.props.pageProps);
  const productData = allData.props.pageProps.initialData.data.product;
  // console.log(productData);

  const productURL = `www.walmart.com${allData.props.pageProps.initialData?.data?.contentLayout?.pageMetadata?.pageContext?.itemContext.productUrl}`;
  // const WalmartURL = document.getElementsById("walmartURL");
  const UPC = document.getElementById("upcId").innerText;
  const cost = document.getElementById("productCostInput").value;
  const sale = document.getElementById("salePriceInput").value;
  // const referral = document.getElementById("referralFees").textContent;
  const fulfillment = document.getElementById("productShippingFee").value;
  const profit = document.getElementById("profitFormInput").value;
  const roi = document.getElementById("roiFormInput").value;
  const estSale = document.getElementById("esSales-show").value;
  // console.log(productData);
  const walmartURL = "https://www.walmart.com/ip/" + productData.usItemId;

  csvContent += `${productURL},${walmartURL},${UPC},${cost},${sale},${""},${fulfillment},${profit},${roi},${""}\r\n`;

  createDownloadFile(csvContent, "Product Export");
}

function createDownloadFile(csvContent, fileName) {
  // Encode and create a link for download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const _fileName = `${fileName}.csv`;
  link.setAttribute("download", _fileName);
  document.body.appendChild(link); // Required for Firefox

  link.click(); // Trigger the download

  document.body.removeChild(link); // Clean up
}

function addEventListenersToButtons() {
  const googleBtn = document.querySelector(".second-links-div-google-btn");
  const amazonBtn = document.querySelector(".second-links-div-amazon-btn");
  const ebayBtn = document.querySelector(".second-links-div-ebay-btn");
  // const downloadBtn = document.querySelector(".seller-download-btn"); // Download button for csv
  const downloadBtn = document.getElementById("sellerDownloadBtn"); // Download button for csv
  // const productDownloadBtn = document.querySelector(".product-download-btn"); // Download button for csv
  const productDownloadBtn = document.getElementById("productDownloadBtn"); // Download button for csv
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");
  const backButton = document.getElementById("backButton");
  const productToggleSwitch = document.getElementById("productTitleToggle");
  const itemIdToggleSwitch = document.getElementById("itemIdToggle");
  const upcIdToggleSwitch = document.getElementById("upcToggle");
  const minRoiInputElement = document.getElementById("minRoiInput");
  const wfsRadio = document.getElementById("wfsRadio");
  const fbmRadio = document.getElementById("fbmRadio");
  const productTitleRadio = document.getElementById("productTitleRadio");
  const upcRadio = document.getElementById("upcRadio");

  // Set the default radio button to checked for product title
  productTitleRadio.checked = true;

  // Set up the event listener on the button
  document
    .getElementById("productTitle")
    .addEventListener("click", handleProductTitleClick);

  document
    .getElementById("itemId")
    .addEventListener("click", handleItemIdClick);

  document.getElementById("upcId").addEventListener("click", handleUpcIdClick);

  // Call setProductTitle to initialize the title
  setProductTitle();
  loadToggleState();

  // Function to load the initial state from localStorage
  function loadToggleState() {
    const isChecked = JSON.parse(localStorage.getItem("productTitleToggle"));
    productToggleSwitch.checked = isChecked || false;

    const itemIdToggleState = JSON.parse(localStorage.getItem("itemIdToggle"));
    itemIdToggleSwitch.checked = itemIdToggleState || false;

    const upcIdToggleState = JSON.parse(localStorage.getItem("upcToggle"));
    upcIdToggleSwitch.checked = upcIdToggleState || false;

    const storedMinRoi = localStorage.getItem("minRoiInput");
    minRoiInputElement.value = storedMinRoi || "";

    // Load the fulfillment method from localStorage
    const storedFulfillmentMethod = localStorage.getItem("fulfillmentMethod");
    if (storedFulfillmentMethod === "wfs") {
      wfsRadio.checked = true;
      fbmRadio.checked = false;
    } else if (storedFulfillmentMethod === "fbm") {
      wfsRadio.checked = false;
      fbmRadio.checked = true;
    } else {
      // Default to WFS if no value is stored
      wfsRadio.checked = true;
      fbmRadio.checked = false;
    }

    const storedSearchPreference = localStorage.getItem("searchPreference");
    if (storedSearchPreference) {
      if (storedSearchPreference === "producttitle") {
        productTitleRadio.checked = true;
      } else if (storedSearchPreference === "upc") {
        upcRadio.checked = true;
      }
    }
  }

  // Save button click event listener
  saveButton.addEventListener("click", () => {
    localStorage.setItem("productTitleToggle", productToggleSwitch.checked);
    localStorage.setItem("itemIdToggle", itemIdToggleSwitch.checked);
    localStorage.setItem("upcToggle", upcIdToggleSwitch.checked);
    localStorage.setItem("minRoiInput", minRoiInputElement.value);

    // Save the fulfillment method
    const selectedFulfillmentMethod = document.querySelector(
      'input[name="fulfillment-method"]:checked'
    );
    localStorage.setItem(
      "fulfillmentMethod",
      selectedFulfillmentMethod ? selectedFulfillmentMethod.value : "wfs"
    );

    const selectedSearchPreference = document.querySelector(
      'input[name="title-upc"]:checked'
    ).value;
    localStorage.setItem("searchPreference", selectedSearchPreference);

    updateProductShippingFee();
    updateTotalCost();
    handleBackButton();
  });

  // Cancel button click event listener
  cancelButton.addEventListener("click", () => {
    handleBackButton();
  });

  googleBtn.addEventListener("click", function () {
    openSearchResult("https://www.google.com/search?q=");
  });

  amazonBtn.addEventListener("click", function () {
    openSearchResult("https://www.amazon.com/s?k=");
  });

  ebayBtn.addEventListener("click", function () {
    openSearchResult("https://www.ebay.com/sch/i.html?_nkw=");
  });

  downloadBtn.addEventListener("click", function () {
    downloadSellersDataAsCSV();
  });
  productDownloadBtn.addEventListener("click", function () {
    console.log("Download Product button clicked");
    downloadProductDataAsCSV();
  });

  // Adding event listener for settingImage button
  const settingImage = document.getElementById("settingImage");
  if (settingImage) {
    settingImage.addEventListener("click", function () {
      // Hide show-item-info-div
      const showItemInfoDiv = document.querySelector(".show-item-info-div");
      if (showItemInfoDiv) {
        showItemInfoDiv.classList.add("hidden");
      }

      // Show settings div
      const settingsDiv = document.getElementById("settingsDiv");
      if (settingsDiv) {
        settingsDiv.classList.remove("hidden");
      }
    });
  }

  // Function to handle back button functionality
  function handleBackButton() {
    // Hide settingsDiv
    const settingsDiv = document.getElementById("settingsDiv");
    if (settingsDiv) {
      settingsDiv.classList.add("hidden");
    }

    // Show show-item-info-div
    const showItemInfoDiv = document.querySelector(".show-item-info-div");
    if (showItemInfoDiv) {
      showItemInfoDiv.classList.remove("hidden");
    }
  }

  // Event listener for back button inside settingsDiv
  if (backButton) {
    backButton.addEventListener("click", handleBackButton);
  }
}

function setTableValues(productData) {
  document.getElementById("sellertNameTable").textContent =
    productData.sellerDisplayName;
  document.getElementById("productPriceTable").textContent =
    productData.priceInfo.currentPrice.priceString;
  document.getElementById("productStockTable").textContent =
    productData.fulfillmentOptions[0].availableQuantity;

  const productRatingTable = document.getElementById("productRatingTable");
  if (productRatingTable) {
    const starImage = document.createElement("img");
    starImage.src = chrome.runtime.getURL("images/star.png");
    starImage.alt = "Star";
    starImage.width = 16; // Adjust the width as needed
    starImage.height = 16; // Adjust the height as needed

    productRatingTable.appendChild(starImage);
    productRatingTable.appendChild(
      document.createTextNode(productData.sellerAverageRating)
    );
  }
}

function updateTotalCost() {
  let productCost = parseFloat(
    productCostInputElement.value.replace("$", "").trim()
  );
  if (isNaN(productCost)) productCost = 0;

  let shippingFee = parseFloat(
    productShippingFeeElement.value.replace("$", "").trim()
  );
  if (isNaN(shippingFee)) shippingFee = 0;

  let taxRate = parseFloat(taxRateInputElement.value.replace("%", "").trim());
  if (isNaN(taxRate)) taxRate = 0;

  const taxValue = productCost * (taxRate / 100);

  const fulfillmentMethod = localStorage.getItem("fulfillmentMethod");

  let totalCost;
  if (fulfillmentMethod === "wfs" || !fulfillmentMethod) {
    totalCost = productCost + taxValue;
  } else if (fulfillmentMethod === "fbm") {
    totalCost = productCost + shippingFee + taxValue;
  }

  totalCostInputElement.value = `$ ${totalCost.toFixed(2)}`;

  productCostInputElement.value = `$ ${productCost.toFixed(2)}`;
  productShippingFeeElement.value = `$ ${shippingFee.toFixed(2)}`;
  taxRateInputElement.value = `${taxRate} %`;

  updateSalePriceAndProfit(totalCost);
}

function updateSalePriceAndProfit(totalCost) {
  let saleMargin = parseFloat(
    saleMarginInputElement.value.replace("$", "").trim()
  );
  if (isNaN(saleMargin)) saleMargin = 0;

  const salePrice = totalCost + saleMargin;
  salePriceInputElement.value = `$ ${salePrice.toFixed(2)}`;

  const profit = salePrice - totalCost;
  profitFormInputElement.value = `$ ${profit.toFixed(2)}`;

  const roi = (profit / totalCost) * 100;
  roiFormInputElement.value = `${roi.toFixed(2)} %`;

  const minRoiValue = parseFloat(localStorage.getItem("minRoiInput"));

  updateRevenue(salePrice);

  if (!isNaN(minRoiValue) && roi >= minRoiValue) {
    roiFormInputElement.style.borderColor = "green";
    roiFormInputElement.style.boxShadow = "0 0 5px green";
  } else {
    roiFormInputElement.style.borderColor = "red";
    roiFormInputElement.style.boxShadow = "0 0 5px red";
  }

  if (profit > 0) {
    profitFormInputElement.style.borderColor = "green";
    profitFormInputElement.style.boxShadow = "0 0 5px green";
  } else {
    profitFormInputElement.style.borderColor = "red";
    profitFormInputElement.style.boxShadow = "0 0 5px red";
  }

  updateRevenue(salePrice);
}

function updateRevenue(salePrice) {
  const estSalesElement = document.getElementById("esSales-show");
  const revenueElement = document.getElementById("revenue-show");

  let estSales = parseFloat(
    estSalesElement.textContent.replace("$", "").trim()
  );

  if (isNaN(estSales)) estSales = 0;

  const revenue = estSales * salePrice;

  if (revenueElement) {
    revenueElement.textContent = `$ ${revenue.toFixed(2)}`;
  }
}

function enforceDollarSign(inputElement) {
  if (!inputElement.value.startsWith("$")) {
    inputElement.value = `$ ${inputElement.value.replace("$", "").trim()}`;
  }
}

function updateProductShippingFee() {
  // Retrieve the fulfillmentMethod from local storage
  let fulfillmentMethod = localStorage.getItem("fulfillmentMethod");

  // Retrieve the shipping fee from local storage
  let shippingFee = parseFloat(localStorage.getItem("shippingFee"));

  // Get the productShippingFee element
  let productShippingFeeElement = document.getElementById("productShippingFee");

  if (productShippingFeeElement) {
    // Check if fulfillmentMethod is "wfs" or not set
    if (fulfillmentMethod === "wfs" || !fulfillmentMethod) {
      // Clear the value and make the field read-only
      productShippingFeeElement.value = "";
      productShippingFeeElement.readOnly = true;
    } else {
      // Set the value of productShippingFee as usual and make it editable
      productShippingFeeElement.value = `$ ${shippingFee.toFixed(2)}`;
      productShippingFeeElement.readOnly = false;
    }
  }
}

function setProductData(jsonData) {
  const productData = jsonData.props.pageProps.initialData.data.product;
  const takeTotalReview =
    jsonData.props.pageProps.initialData.data.reviews.totalReviewCount;
  const wasPrice = parseFloat(productData.priceInfo.currentPrice.price);
  const shippingFee = parseFloat(
    jsonData.props.pageProps.bootstrapData.cv.subscription._all_.shippingFee
  );

  // Store the shipping fee in local storage
  localStorage.setItem("shippingFee", shippingFee);

  productCostInputElement = document.getElementById("productCostInput");
  if (productCostInputElement) {
    productCostInputElement.value = `$ ${wasPrice.toFixed(2)}`;
  }

  // Retrieve the fulfillmentMethod from local storage
  let fulfillmentMethod = localStorage.getItem("fulfillmentMethod");

  // Get the productShippingFee element
  productShippingFeeElement = document.getElementById("productShippingFee");

  if (productShippingFeeElement) {
    // Check if fulfillmentMethod is "wfs" or not set
    if (fulfillmentMethod === "wfs" || !fulfillmentMethod) {
      // Clear the value and make the field read-only
      productShippingFeeElement.value = "";
      productShippingFeeElement.readOnly = true;
    } else {
      // Set the value of productShippingFee as usual and make it editable
      productShippingFeeElement.value = `$ ${shippingFee.toFixed(2)}`;
      productShippingFeeElement.readOnly = false;
    }
  }

  totalCostInputElement = document.getElementById("totalCostInput");
  taxRateInputElement = document.getElementById("taxesInput");
  saleMarginInputElement = document.getElementById("saleMarginInput");
  salePriceInputElement = document.getElementById("salePriceInput");
  profitFormInputElement = document.getElementById("profitFormInput");
  roiFormInputElement = document.getElementById("roiFormInput");

  productCostInputElement.addEventListener("input", updateTotalCost);
  productShippingFeeElement.addEventListener("input", updateTotalCost);
  taxRateInputElement.addEventListener("input", updateTotalCost);
  saleMarginInputElement.addEventListener("input", () => {
    enforceDollarSign(saleMarginInputElement);
    const totalCost = parseFloat(
      totalCostInputElement.value.replace("$", "").trim()
    );
    if (!isNaN(totalCost)) {
      updateSalePriceAndProfit(totalCost);
    }
  });

  updateTotalCost();

  saleMarginInputElement.addEventListener("blur", () =>
    enforceDollarSign(saleMarginInputElement)
  );

  const itemIdElement = document.getElementById("itemId");
  if (itemIdElement) {
    itemIdElement.textContent = productData.usItemId;
  }

  const upcElement = document.getElementById("upcId");
  if (upcElement) {
    upcElement.textContent = productData.upc;
    localStorage.setItem("upc", productData.upc);
  }

  let description = productData.shortDescription;
  description = description.replace(/^<p>/, "").replace(/<\/p>$/, "");
  const descriptionElement = document.getElementById("descriptionContent");
  if (descriptionElement) {
    descriptionElement.innerHTML = description;
  }

  const specificationsElement = document.getElementById(
    "specificationsContent"
  );
  if (specificationsElement) {
    const specifications =
      jsonData.props.pageProps.initialData.data.idml.specifications;
    specificationsElement.innerHTML = "";
    specifications.forEach((spec) => {
      let specItem = document.createElement("div");
      specItem.style.display = "flex";
      specItem.style.justifyContent = "space-between";
      specItem.style.marginRight = "7px";
      specItem.innerHTML = `<strong>${spec.name}:</strong> <span>${spec.value}</span>`;
      specificationsElement.appendChild(specItem);
    });
  }

  const shippingElement = document.getElementById("shippingContent");
  if (shippingElement) {
    const shippingOptions = productData.fulfillmentOptions;
    shippingElement.innerHTML = "";
    shippingOptions.forEach((option) => {
      const status =
        option.availabilityStatus === "IN_STOCK"
          ? "Available"
          : "Not available";
      const shippingItem = document.createElement("div");
      shippingItem.style.display = "flex";
      shippingItem.style.justifyContent = "space-between";
      shippingItem.style.margin = "0 20px";
      shippingItem.innerHTML = `<strong>${option.type}:</strong> ${status}`;
      shippingElement.appendChild(shippingItem);
    });
  }

  const flagsData = productData.badges.flags;
  const badgesContainer = document.querySelector(".showBadges");
  if (flagsData && flagsData.length > 0) {
    flagsData.forEach((flag) => {
      const badgeDiv = document.createElement("div");
      badgeDiv.textContent = flag.text;
      if (flag.text === "Best seller") {
        badgeDiv.style.backgroundColor = "rgba(0, 113, 220, 0.08)";
        badgeDiv.style.color = "rgba(0, 113, 220, 1)";
      } else if (flag.text === "Popular pick") {
        badgeDiv.style.backgroundColor = "rgba(220, 0, 53, 0.08)";
        badgeDiv.style.color = "rgba(220, 0, 53, 1)";
      } else if (flag.text === "Flash Deal") {
        badgeDiv.style.backgroundColor = "#FFF9E9";
        badgeDiv.style.color = "#995213";
      } else if (flag.text === "Rollback") {
        badgeDiv.style.backgroundColor = "rgba(254, 1, 2, 0.08)";
        badgeDiv.style.color = "rgba(254, 1, 2, 1)";
      } else {
        badgeDiv.style.border = "1px solid rgba(151, 139, 200, 1)";
        badgeDiv.style.backgroundColor = "rgba(255, 255, 200, 0.08)";
        badgeDiv.style.color = "rgba(151, 139, 200, 1)";
      }
      badgeDiv.style.padding = "6px";
      badgeDiv.style.gap = "4px";
      badgeDiv.style.borderRadius = "10px";
      badgeDiv.style.fontSize = "12px";
      badgeDiv.style.opacity = "1";
      badgesContainer.appendChild(badgeDiv);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = "";
    badgesContainer.appendChild(p);
  }

  const numberOfReviews = takeTotalReview;
  const totalPurchaseAmount = numberOfReviews / 0.05;
  const estSales = totalPurchaseAmount / 3;
  const estSalesElement = document.getElementById("esSales-show");
  if (estSalesElement) {
    estSalesElement.textContent = `$${estSales.toFixed(2)}`;
  }

  updateTotalCost();
  setTableValues(productData);
}

// let productCostInputElement,
//   productShippingFeeElement,
//   totalCostInputElement,
//   taxRateInputElement,
//   saleMarginInputElement,
//   salePriceInputElement,
//   profitFormInputElement,
//   roiFormInputElement;

function handleNextData() {
  const allData = document.getElementById("__NEXT_DATA__");
  if (allData) {
    try {
      const jsonData = JSON.parse(allData.textContent || allData.innerText);
      console.log("ALL DATA IS:", jsonData.props.pageProps.initialData.data);
      setProductData(jsonData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  } else {
    console.error("__NEXT_DATA__ script tag not found.");
  }
}

function loadSidebarContent(sidebarDiv) {
  const url = chrome.runtime.getURL("sidebar.html");
  fetchSidebarContent(url)
    .then((data) => {
      sidebarDiv.innerHTML = data;
      handleTabSwitching();
      handleAccordion();
      setImageSources();
      setupLoginButton();
      setProductImage();
      setProductPrice();
      setProductTitle();
      setRatingAndReviews();
      handleNextData();
      addEventListenersToButtons();
    })
    .catch((error) => console.error("Error loading sidebar content:", error));
}

function createSidebar() {
  const sidebarDiv = document.createElement("div");
  sidebarDiv.id = "sidebarDiv";
  sidebarDiv.className = "col-3";
  loadSidebarContent(sidebarDiv);
  return sidebarDiv;
}

function adjustLayout() {
  const mainContent = document.getElementById("__next");
  if (mainContent) {
    const containerDiv = document.createElement("div");
    containerDiv.style.display = "flex";
    containerDiv.style.width = "100%";

    mainContent.classList.remove("col-12");
    mainContent.classList.add("col-9");

    mainContent.parentNode.insertBefore(containerDiv, mainContent);
    containerDiv.appendChild(mainContent);
    containerDiv.appendChild(createSidebar());
  }
}

window.adjustLayout = adjustLayout;

function toggleSidebar() {
  const sidebar = document.getElementById("sidebarDiv");
  const mainContent = document.getElementById("__next");
  if (sidebar) {
    sidebar.remove();
    if (mainContent) {
      mainContent.classList.remove("col-9");
      mainContent.classList.add("col-12");
    }
  } else {
    adjustLayout();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSidebar") {
    toggleSidebar();

    sendResponse({ status: "toggled" });
  }
});
