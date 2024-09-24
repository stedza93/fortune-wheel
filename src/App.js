import goldenCoin from "./golden-coin.png";
import lollypop from "./lollypop.svg";
import indexChangeSound from "./start.mp3";
import { gsap } from "gsap";
import restSound from "./stop.mp3";
import sadSound from "./sadSound.mp3";
import special from "./special.png";
import wheelImage1 from "./wheel1.png";
import svgCapt from "./svgCapt.svg";
import purpleOverlay from "./overlay-back.png";
import goldenWheel from "./golden-wheel.png";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Wheel } from "spin-wheel";
import Lottie from "lottie-react";
import moneyRainAnimation from "./animation.json";
import giraffe from "./giraffe.json";
import balloons from "./balloons.json";
import moneyBagsAnimation from "./money.json";
import sadAnimation from "./sad.json";
import sadAnimation2 from "./sad2.json";
import sadAnimation3 from "./sad3.json";
import sadAnimation4 from "./sad4.json";
import simpleOverlay from "./overlaysimple.png";
import overlayGold from "./overlaygold.png";
import volcanoBackground from "./volcano.gif";
import animatedCircles from "./animated-circles.gif";
import prizeTexture from "./prizeTexture.png";

const indexChangeAudio = new Audio(indexChangeSound);
const restAudio = new Audio(restSound);
const sadAudio = new Audio(sadSound);

// Helper function to create an HTMLImageElement
const createImageElement = (src, opacity) => {
  const img = new Image();
  img.src = src;
  return img;
};

const animationMap = {
  "Ballons firework": balloons,
  "Giraffe Animation": giraffe,
  "Money rain": moneyRainAnimation,
  "Money bags": moneyBagsAnimation,
  "Sad animation": sadAnimation,
};

const noPrizeAnimationMap = {
  "Sad animation1": sadAnimation,
  "Sad animation2": sadAnimation2,
  "Sad animation3": sadAnimation3,
  "Sad animation4": sadAnimation4,
};

const wheelImageOptions = {
  "Golden Wheel": goldenWheel,
  Lollypop: lollypop,
  "Golden Coin": goldenCoin,
  "Ugly cut wheel": wheelImage1,
};

const overlayImageOptions = {
  "Star Overlay": svgCapt,
  "Purple Overlay": purpleOverlay,
  "Simple Overlay": simpleOverlay,
  "Overlay Gold": overlayGold,
};

const backgroundImageOptions = {
  "No Image": "",
  "Animated volcano": volcanoBackground,
  "Animated Circles": animatedCircles,
  "Prize Texture": prizeTexture,
};

const fontFamilyOptions = [
  "monospace",
  "Arial, sans-serif",
  "Courier New, Courier, monospace",
  "Georgia, serif",
  "Tahoma, Geneva, sans-serif",
  "Trebuchet MS, sans-serif",
  "Verdana, sans-serif",
  // Example for Google Fonts
  '"Roboto", sans-serif',
  '"Permanent Marker", cursive', // External font 2
];

const createImageElementAsync = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

function App() {
  const containerRef = useRef(null);
  const [wheel, setWheel] = useState(null); // Keep the wheel instance
  const [landToItem, setLandToItem] = useState(0); // Keep the wheel instance
  const [showLottie, setShowLottie] = useState(false);
  const [showLottieNoPrize, setShowLottieNoPrize] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState("");
  const [selectedNoPrizeAnimation, setSelectedNoPrizeAnimation] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [items, setItems] = useState([
    {
      label: "Item 1",
      imageRadius: 0.3,
      weight: 1,
      imageScale: 0.5,
      labelColor: "#ffffff",
      backgroundColor: "#fdc963",
    },
    {
      label: "No Prize Item",
      labelColor: "#ffffff",
      backgroundColor: "#2b87e9",
      weight: 1,
      noPrizeItem: true,
    },
    {
      label: "Item 3",
      image: createImageElement(special),
      imageScale: 0.65,
      labelColor: "#ffffff",
      weight: 1,
      backgroundColor: "#00cca8",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for editing
  const [newItem, setNewItem] = useState({
    label: "",
    labelColor: "#ffffff",
    backgroundColor: "#000fff",
    imageScale: 0.5,
    imageRadius: 0.5,
    imageRotation: 0,
    noPrizeItem: false,
    weight: 1,
  }); // Form state for new and edited items

  const [wheelConfig, setWheelConfig] = useState({
    isInteractive: false,
    radius: 0.95,
    rotationResistance: 0,
    itemLabelRadius: 0.82,
    itemLabelRadiusMax: 0.5,
    itemLabelRotation: 180,
    itemLabelAlign: "left",
    // itemLabelColors: ["#fff"],
    itemLabelFont: "monospace",
    itemLabelFontSizeMax: 15,
    // itemBackgroundColors: ["#fdc963", "#00cca8", "#2b87e9"],
    // rotationSpeedMax: 1,
    rotationSpeed: 400,
    lineWidth: 2,
    lineColor: "#ffffff",

    // image: createImageElement(goldenWheel),
    // overlayImage: createImageElement(svgCapt),
    items: items, // Pass the initial items
  });

  // Initialize the wheel when the component mounts
  useEffect(() => {
    if (containerRef.current && !wheel) {
      const newWheel = new Wheel(containerRef.current, wheelConfig);
      setWheel(newWheel);
      // Create audio objects

      newWheel.onSpin = () => {
        console.log("BEFORE START");
        setShowLottieNoPrize(false);
        setShowLottie(false);
      };

      // Handle spin stop events (as an example)
    }
  }, [containerRef, wheel, wheelConfig]); // Initialize the wheel only once

  // Preload font family
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
    link.rel = "stylesheet";
    const permanentMarkerLink = document.createElement("link");
    permanentMarkerLink.href =
      "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap";
    permanentMarkerLink.rel = "stylesheet";
    document.head.appendChild(link);
    document.head.appendChild(permanentMarkerLink);
  }, []);

  // Manually update the wheel configuration or items when the state changes, without re-initializing
  useEffect(() => {
    if (wheel) {
      console.log("AAA");
      wheel.items = items;
      wheel.onCurrentIndexChange = (event) => {
        // console.log("PROMJENA INDEXA", items);
        // Reset to start
        indexChangeAudio.currentTime = 0;
        indexChangeAudio.play().catch((error) => {
          console.error("Failed to play index change sound:", error);
        });
      };
      wheel.onRest = (event) => {
        console.log("Wheel stopped at index:", event.currentIndex);
        console.log(items, "Items");
        const winnerLabel = items[event.currentIndex].label;
        const noPrizeItem = items[event.currentIndex].noPrizeItem;
        if (noPrizeItem) {
          sadAudio.play().catch((error) => {
            console.error("Failed to play sad sound:", error);
          });
        } else {
          restAudio.play().catch((error) => {
            console.error("Failed to play rest sound:", error);
          });
        }
        const winnerElement = document.getElementById("test");
        if (winnerElement) {
          winnerElement.textContent = `${
            noPrizeItem ? "Better luck next time" : "Winner:"
          } ${winnerLabel}`;

          // Animate the winner's name using GSAP
          gsap.fromTo(
            winnerElement,
            { opacity: 0, scale: 0, color: "#000" },
            {
              opacity: 1,
              scale: 1.8,
              color: "#ffffff",
              duration: 2,
              ease: "elastic.out(1, 0.3)", // Elastic bounce
              onComplete: () => {
                // Optionally set a timeout to hide after a delay
                setTimeout(() => {
                  // Hide the winner element after some time
                  gsap.to(winnerElement, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                      // Reset the element's state to prepare it for the next spin
                      gsap.set(winnerElement, { clearProps: "all" });
                    },
                  });
                }, 1500); // Reset after 3 seconds
              },
            }
          );

          if (noPrizeItem) {
            setShowLottieNoPrize(true);
          } else {
            setShowLottie(true);
          }

          // setTimeout(() => {
          //   gsap.to(winnerElement, { opacity: 0, scale: 0, duration: 0.5 });
          // }, 4000);
        }
      };
    }
  }, [items, wheelConfig, wheel]);

  // UseEffect to update items when editing in real-time
  useEffect(() => {
    // if (wheel) {
    //   wheel.overlayImage = createImageElement(pngDesign);
    //   wheel.spinTo(0);
    // }
    if (selectedItem !== null) {
      setItems((prevItems) =>
        prevItems.map((item, index) =>
          index === selectedItem ? { ...item, ...newItem } : item
        )
      );
    }
  }, [newItem]);

  const spinWheel = () => {
    if (wheel) {
      wheel.spinToItem(landToItem, 3500, false, 2);
    }
  };

  // Handle form submit (save item)
  const handleFormSubmit = (e) => {
    console.log(newItem, "NEWWWW");
    e.preventDefault();
    if (selectedItem === null) {
      // Add new item
      setItems((prevItems) => [...prevItems, newItem]);
    } else {
      // Edit existing item logic (already handled via useEffect)
      const updatedItems = items.map((item, index) =>
        index === selectedItem ? newItem : item
      );
      setItems(updatedItems);
    }
    // Reset form
    setNewItem({
      label: "",
      labelColor: "",
      imageScale: 0.5,
      imageRadius: 0.5,
      imageRotation: 0,
      weight: 1,
    });
    setSelectedItem(null);
  };

  // Handle edit item
  // Handle image upload (convert the uploaded image to an HTMLImageElement)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgElement = createImageElement(reader.result);
        setNewItem((prev) => ({ ...prev, image: imgElement }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to remove the image
  const handleRemoveImage = () => {
    setNewItem((prev) => ({ ...prev, image: null }));
  };

  // When editing an item, pre-fill the form with its existing data
  const handleEditItem = (index) => {
    setSelectedItem(index);
    const itemToEdit = items[index];
    setNewItem({
      label: itemToEdit.label || "",
      labelColor: itemToEdit.labelColor || "",
      backgroundColor: itemToEdit.backgroundColor || "",
      imageScale: itemToEdit.imageScale || 0.5,
      imageRadius: itemToEdit.imageRadius || 0.5,
      imageRotation: itemToEdit.imageRotation || 0,
      image: itemToEdit.image || null, // Set the existing image if available
      noPrizeItem: itemToEdit.noPrizeItem,
      weight: itemToEdit.weight,
    });
  };

  // Handle delete item
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Function to handle updates for wheelConfig state
  const handleWheelConfigChange = async (e) => {
    if (!wheel) return;
    const { name, value } = e.target;
    if (!value) {
      setWheelConfig((prevConfig) => ({
        ...prevConfig,
        [name]: null, // Clear the image if no option is selected
      }));
      wheel[name] = null;
      return;
    }
    console.log(typeof value, "TYPEOF", name);
    // Handle overlayImage or image field changes
    // Find the selected image option by src
    let selectedOptionSrc;
    if (name === "overlayImage") {
      selectedOptionSrc = Object.values(overlayImageOptions).find(
        (src) => new URL(src, window.location.origin).href === value
      );
    } else if (name === "image") {
      selectedOptionSrc = Object.values(wheelImageOptions).find(
        (src) => new URL(src, window.location.origin).href === value
      );
    }

    if (selectedOptionSrc) {
      // Create an HTMLImageElement and set it in wheelConfig and wheel
      const img = await createImageElementAsync(selectedOptionSrc);
      setWheelConfig((prevConfig) => ({
        ...prevConfig,
        [name]: img,
      }));
      wheel[name] = img; // Update the wheel
    } else {
      const newValue = [
        "radius",
        "itemLabelRadius",
        "itemLabelRadiusMax",
        "itemLabelRotation",
        "itemLabelFontSizeMax",
        "lineWidth",
      ].includes(name)
        ? Number(value)
        : value;
      setWheelConfig((prevConfig) => ({
        ...prevConfig,
        [name]: newValue,
      }));
      wheel[name] = newValue;
    }
  };

  // Function to handle image upload for overlay image
  const handleOverlayImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgElement = createImageElement(reader.result);
        setWheelConfig((prevConfig) => ({
          ...prevConfig,
          overlayImage: imgElement,
        }));
        wheel.overlayImage = imgElement;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnimationChange = (e, noPrize = false) => {
    if (noPrize) {
      setSelectedNoPrizeAnimation(e.target.value);
      setShowLottieNoPrize(true);
    } else {
      setSelectedAnimation(e.target.value);
      setShowLottie(true);
    }
  };

  const handleBackgroundImageChange = (e) => {
    const value = e.target.value;

    setBackgroundImage(value); // Update the state with the selected value
    if (containerRef.current) {
      if (value) {
        containerRef.current.style.backgroundImage = `url(${value})`; // Set the background image
      } else {
        containerRef.current.style.backgroundImage = ""; // Remove background image if "No Image" is selected
      }
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div>
          <div ref={containerRef} className="spin-container">
            <div id="test"></div>
            {showLottie && selectedAnimation && (
              <div className="lottie-container">
                {}
                <Lottie
                  animationData={animationMap[selectedAnimation]}
                  loop={false} // Play only once
                  autoplay={true} // Start automatically
                  onComplete={() => setShowLottie(false)} // Hide Lottie when animation is complete
                />
              </div>
            )}
            {showLottieNoPrize && selectedNoPrizeAnimation && (
              <div className="lottie-container">
                {}
                <Lottie
                  animationData={noPrizeAnimationMap[selectedNoPrizeAnimation]}
                  loop={false} // Play only once
                  autoplay={true} // Start automatically
                  onComplete={() => setShowLottieNoPrize(false)} // Hide Lottie when animation is complete
                />
              </div>
            )}
            <div id="winner-name"></div>
          </div>

          <div>
            {" "}
            <button
              style={{ position: "relative", zIndex: 2 }}
              onClick={spinWheel}
            >
              SpinWheel
            </button>
          </div>
        </div>

        <div>
          {/* Wheel Configuration Form */}
          <h1>Wheel Configuration</h1>
          <form>
            <div style={{ marginTop: "10px" }}>
              <label>
                Land to:
                <select
                  name="itemLabelAlign"
                  value={landToItem}
                  onChange={(e) => setLandToItem(e.target.value)}
                >
                  {items.map((item, index) => (
                    <option key={index} value={index}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Select for Font Family */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Select Font Family:
                <select
                  name="itemLabelFont"
                  value={wheelConfig.itemLabelFont || "monospace"} // Default to monospace
                  onChange={handleWheelConfigChange}
                >
                  {fontFamilyOptions.map((font, index) => (
                    <option key={index} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Radius */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Radius:
                <input
                  type="range"
                  name="radius"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={wheelConfig.radius}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Item Label Radius */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Item Label Radius:
                <input
                  type="range"
                  name="itemLabelRadius"
                  min="0"
                  max="1"
                  step="0.05"
                  value={wheelConfig.itemLabelRadius}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Item Label Radius Max */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Item Label Radius Max:
                <input
                  type="range"
                  name="itemLabelRadiusMax"
                  min="0"
                  max="1"
                  step="0.05"
                  value={wheelConfig.itemLabelRadiusMax}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Item Label Rotation */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Item Label Rotation:
                <input
                  type="range"
                  name="itemLabelRotation"
                  min="0"
                  max="360"
                  step="5"
                  value={wheelConfig.itemLabelRotation}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Item Label Align */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Item Label Align:
                <select
                  name="itemLabelAlign"
                  value={wheelConfig.itemLabelAlign}
                  onChange={handleWheelConfigChange}
                >
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </label>
            </div>

            {/* Item Label Font Size Max */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Item Label Font Size Max:
                <input
                  type="range"
                  name="itemLabelFontSizeMax"
                  min="0"
                  max="100"
                  step="1"
                  value={wheelConfig.itemLabelFontSizeMax}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Line Width */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Line Width:
                <input
                  type="range"
                  name="lineWidth"
                  min="0"
                  max="15"
                  step="0.5"
                  value={wheelConfig.lineWidth}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>

            {/* Line Color */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Line Color:
                <input
                  type="color"
                  name="lineColor"
                  value={wheelConfig.lineColor}
                  onChange={handleWheelConfigChange}
                />
              </label>
            </div>
            {/* After spin animation */}
            <div style={{ marginTop: "10px" }}>
              <label>
                After spin prize animation:
                <select
                  onChange={handleAnimationChange}
                  value={selectedAnimation}
                >
                  <option value="">No Animation</option>
                  {Object.keys(animationMap).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>
                After spin no prize animation:
                <select
                  onChange={(e) => handleAnimationChange(e, true)}
                  value={selectedNoPrizeAnimation}
                >
                  <option value="">No Animation</option>
                  {Object.keys(noPrizeAnimationMap).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {/* Select for Overlay Image */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Select Overlay Image:
                <select
                  name="overlayImage"
                  value={wheelConfig.overlayImage?.src || ""}
                  onChange={handleWheelConfigChange}
                >
                  <option value="">No overlay</option>
                  {Object.keys(overlayImageOptions).map((key, index) => (
                    <option
                      key={index}
                      value={
                        new URL(
                          overlayImageOptions[key],
                          window.location.origin
                        ).href
                      }
                    >
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Select for Background Image */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Select Background Image:
                <select
                  name="backgroundImage"
                  value={backgroundImage || ""}
                  onChange={(e) => handleBackgroundImageChange(e)}
                >
                  {/* Option to remove background */}
                  {Object.keys(backgroundImageOptions).map((key, index) => (
                    <option
                      key={index}
                      value={
                        new URL(
                          backgroundImageOptions[key],
                          window.location.origin
                        ).href
                      }
                    >
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Select for Wheel Image */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Select Wheel Image:
                <select
                  name="image"
                  value={wheelConfig.image?.src || ""}
                  onChange={handleWheelConfigChange}
                >
                  <option value="">No image</option>
                  {Object.keys(wheelImageOptions).map((key, index) => (
                    <option
                      key={index}
                      value={
                        new URL(wheelImageOptions[key], window.location.origin)
                          .href
                      }
                    >
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Overlay Image Upload */}
            <div style={{ marginTop: "10px" }}>
              <label>
                Upload Overlay Image:
                <input
                  type="file"
                  accept="image/*"
                  style={{ marginLeft: "10px" }}
                  onChange={handleOverlayImageUpload}
                />
              </label>
            </div>

            {/* Display the uploaded overlay image preview if available */}
            {wheelConfig.overlayImage && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={wheelConfig.overlayImage.src}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>
        </div>

        <div>
          {/* Form to add or edit items */}
          <h1>{selectedItem === null ? "Add New Item" : "Edit Item"}</h1>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>
                Label:
                <input
                  type="text"
                  value={newItem.label}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, label: e.target.value }))
                  }
                  required
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Item weight:
                <input
                  type="number"
                  min={1}
                  style={{ marginLeft: "10px" }}
                  value={newItem.weight}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      weight: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Label Color:
                <input
                  type="color"
                  style={{ marginLeft: "10px" }}
                  value={newItem.labelColor}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      labelColor: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>
                Background Color:
                <input
                  type="color"
                  value={newItem.backgroundColor}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Image size:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={newItem.imageScale}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      imageScale: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Image position:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={newItem.imageRadius}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      imageRadius: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Image rotation:
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={newItem.imageRotation}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      imageRotation: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            {/* No Prize Item Checkbox */}
            <div style={{ marginTop: "10px" }}>
              <label>
                No Prize Item:
                <input
                  type="checkbox"
                  checked={newItem.noPrizeItem}
                  style={{ marginLeft: "10px" }}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      noPrizeItem: e.target.checked,
                    }))
                  }
                />
              </label>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>
                Upload Image:
                <input
                  type="file"
                  accept="image/*"
                  style={{ marginLeft: "10px" }}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {/* Display the uploaded image preview if available */}
            {newItem.image && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={newItem.image.src}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{ marginLeft: "10px" }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <button type="submit" style={{ marginTop: "10px" }}>
              {selectedItem === null ? "Add New Item" : "Save Changes"}
            </button>
          </form>
          <br />
          <hr />

          {/* Display and edit items */}
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h1>Items</h1>
            {items.map((item, index) => (
              <li key={index}>
                <span>{item.label}</span>
                <span style={{ color: item.labelColor }}>
                  {" "}
                  (Color: {item.labelColor})
                </span>
                <button onClick={() => handleEditItem(index)}>Edit</button>
                <button onClick={() => handleDeleteItem(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
