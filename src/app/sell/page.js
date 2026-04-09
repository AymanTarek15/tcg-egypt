"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/app/components/layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import styles from "./SellPage.module.css";

function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SellPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isCardChosen, setIsCardChosen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSetCode, setSelectedSetCode] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedOfficialImage, setSelectedOfficialImage] = useState("");

  const [condition, setCondition] = useState("near_mint");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [sellerFiles, setSellerFiles] = useState([]);
  // const [sellerPreviews, setSellerPreviews] = useState([]);

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [sellerImages, setSellerImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [edition, setEdition] = useState("1st Edition");
  const [selectedSetId, setSelectedSetId] = useState("");

  const [profileChecked, setProfileChecked] = useState(false);
const [profileIncomplete, setProfileIncomplete] = useState(false);
const [profileMessage, setProfileMessage] = useState("");

  const runSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value.trim()) {
          setResults([]);
          return;
        }

        setSearching(true);
        try {
          const res = await fetch(
            `/api/ygo/search?q=${encodeURIComponent(value)}`,
          );
          const json = await res.json();
          setResults(json.data || []);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 350),
    [],
  );

  useEffect(() => {
  async function checkProfileCompletion() {
    const token =
      localStorage.getItem("access") || localStorage.getItem("token");

    if (!token) {
      setProfileChecked(true);
      setProfileIncomplete(true);
      setProfileMessage("Please log in first.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to load profile.");
      }

      const isComplete =
        data?.first_name?.trim() &&
        data?.last_name?.trim() &&
        data?.phone_number?.trim() &&
        data?.shipping_address?.trim();

      if (!isComplete) {
        setProfileIncomplete(true);
        setProfileMessage(
          "Please complete your profile first: first name, last name, phone number, and shipping address."
        );
      } else {
        setProfileIncomplete(false);
        setProfileMessage("");
      }
    } catch (error) {
      setProfileIncomplete(true);
      setProfileMessage("Could not verify your profile. Please try again.");
    } finally {
      setProfileChecked(true);
    }
  }

  checkProfileCompletion();
}, []);

  useEffect(() => {
    if (isCardChosen) return;
    runSearch(query);
  }, [query, runSearch, isCardChosen]);

async function handleSelectCard(card) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cards/database/?name=${encodeURIComponent(card.name)}`
    );

    if (!res.ok) {
      throw new Error("Failed to load selected card from backend.");
    }

    const data = await res.json();
    const dbCard = data?.results?.[0] || data?.[0];

    if (!dbCard) {
      throw new Error("Card not found in your database.");
    }

    setSelectedCard(dbCard);
    setQuery(dbCard.name);
    setResults([]);
    setIsCardChosen(true);

    const firstSet = dbCard.sets?.[0] || null;
    const firstImage = dbCard.main_image || dbCard.images?.[0]?.image_url || "";

    setSelectedSetCode(firstSet?.set_code || "");
    setSelectedSetId(firstSet?.id || "");
    setSelectedRarity(firstSet?.set_rarity || "");
    setSelectedOfficialImage(firstImage);
  } catch (error) {
    console.error(error);
    setSubmitError(error.message || "Failed to load selected card.");
  }
}

  function handleSetChange(setCode) {
  setSelectedSetCode(setCode);

  if (!selectedCard) return;

  const setInfo = selectedCard.sets?.find((s) => s.set_code === setCode);

  if (setInfo) {
    setSelectedSetId(setInfo.id);
    setSelectedRarity(setInfo.set_rarity || "");
  } else {
    setSelectedSetId("");
    setSelectedRarity("");
  }
}

  function handleOfficialArtSelect(imageUrl) {
    setSelectedOfficialImage(imageUrl);
  }

  

  async function handleSubmit(e) {
  e.preventDefault();
  setSubmitError("");

  if (!profileChecked) {
  setSubmitError("Checking your profile, please wait.");
  return;
}

if (profileIncomplete) {
  setSubmitError(
    "Please complete your profile first: first name, last name, phone number, and shipping address."
  );
  return;
}

  if (!selectedCard) {
    setSubmitError("Please select a card first.");
    return;
  }

  if (!selectedSetCode) {
    setSubmitError("Please choose a set code.");
    return;
  }

  if (!selectedSetId) {
    setSubmitError("Please choose a valid set.");
    return;
  }

  if (!selectedRarity) {
    setSubmitError("Please choose a rarity.");
    return;
  }

  if (!edition) {
    setSubmitError("Please choose an edition.");
    return;
  }

  if (!condition) {
    setSubmitError("Please choose a condition.");
    return;
  }

  if (!selectedOfficialImage) {
    setSubmitError("Please choose an official artwork.");
    return;
  }

  if (!price || Number(price) <= 0) {
    setSubmitError("Please enter a valid price.");
    return;
  }

  if (sellerImages.length === 0) {
    setSubmitError("Please upload at least one seller image.");
    return;
  }

  try {
    setSubmitting(true);

    const uploadedImages = await uploadImagesToCloudinary(sellerImages);

    const selectedSet = selectedCard.sets?.find(
      (s) => s.id === Number(selectedSetId)
    );

    const payload = {
      yugioh_card: selectedCard.id,
      yugioh_card_set: selectedSetId,

      name: selectedCard.name || "",
      // slug: `${selectedCard.slug}-${selectedSetCode}`
      //   .toLowerCase()
      //   .replace(/[^a-z0-9]+/g, "-")
      //   .replace(/^-|-$/g, ""),

      card_description: selectedCard.desc || "",
      seller_description: description || "",

      archetype: selectedCard.archetype || "",
      rarity: selectedRarity || "",
      card_type:
        selectedCard.human_readable_card_type ||
        selectedCard.card_type ||
        "",
      attribute: selectedCard.attribute || "",

      set_name: selectedSet?.set_name || "",
      set_code: selectedSet?.set_code || "",

      condition,
      edition,
      language: "English",
      quantity: 1,
      price,
      image_url: selectedOfficialImage,
      seller_images: uploadedImages.map((img) => img.url),
    };

    const token =
      localStorage.getItem("access") || localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cards/listings/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.detail || data?.message || JSON.stringify(data) || "Failed to publish listing."
      );
    }

    alert("Listing published successfully.");
  } catch (error) {
    setSubmitError(error.message || "Something went wrong.");
  } finally {
    setSubmitting(false);
  }
}

  function removeImage(id) {
    setSellerImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (item) URL.revokeObjectURL(item.url);

      return prev.filter((img) => img.id !== id);
    });
  }

  function addFiles(files) {
    const fileArray = Array.from(files || []);
    if (!fileArray.length) return;

    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    const newItems = imageFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setSellerImages((prev) => [...prev, ...newItems]);
  }

  function handleSellerFilesChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  }

  // console.log(selectedCard);

  async function uploadImagesToCloudinary(images) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadedUrls = [];

  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    uploadedUrls.push({
      url: data.secure_url,
      public_id: data.public_id,
    });
  }

  return uploadedUrls;
}

  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="Create a Listing"
          subtitle="Search a card, choose its artwork, then complete the listing."
        />

        {profileIncomplete && (
  <p className={styles.submitError}>
    {profileMessage} <a style={{color:"white"}} href="/profile">Go to Profile here</a>
  </p>
)}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Search card</label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsCardChosen(false);
                setSelectedCard(null);
                setSelectedSetCode("");
                setSelectedRarity("");
                setSelectedOfficialImage("");
              }}
              placeholder="Start typing a card name..."
            />

            {searching && !isCardChosen && <small>Searching...</small>}

            {!isCardChosen && results.length > 0 && (
              <div className={styles.searchResults}>
                {results.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    className={styles.searchResultItem}
                    onClick={() => handleSelectCard(card)}
                  >
                    {card.image && <img src={card.image} alt={card.name} />}
                    <div>
                      <strong>{card.name}</strong>
                      <small>{card.type}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Card name</label>
              <input type="text" value={selectedCard?.name || ""} readOnly />
            </div>

            <div className={styles.field}>
              <label>Set code</label>
              <select
  value={selectedSetCode}
  onChange={(e) => handleSetChange(e.target.value)}
  disabled={!selectedCard}
>
  <option value="">Select set code</option>
  {(selectedCard?.sets || []).map((setItem) => (
    <option
      key={`${setItem.id}-${setItem.set_code}`}
      value={setItem.set_code}
    >
      {setItem.set_code} — {setItem.set_name} — {setItem.set_rarity}
    </option>
  ))}
</select>
            </div>

            <div className={styles.field}>
              <label>Rarity</label>
              <select
  value={selectedRarity}
  onChange={(e) => setSelectedRarity(e.target.value)}
>
  <option value="">Select rarity</option>
  <option value="Common">Common</option>
  <option value="Rare">Rare</option>
  <option value="Super Rare">Super Rare</option>
  <option value="Ultra Rare">Ultra Rare</option>
  <option value="Secret Rare">Secret Rare</option>
  <option value="Ultimate Rare">Ultimate Rare</option>
  <option value="Gold Rare">Gold Rare</option>
  <option value="Platinum secret Rare">Platinum secret Rare</option>
  <option value="Collector's Rare">Collector's Rare</option>
  <option value="Premium Gold Rare">Premium Gold Rare</option>
  <option value="Starlight Rare">Starlight Rare</option>
  <option value="Quarter Century Rare">Quarter Century Rare</option>
</select>


            </div>

            <div className={styles.field}>
  <label>Edition</label>
  <select value={edition} onChange={(e) => setEdition(e.target.value)}>
    <option value="">Select edition</option>
    <option value="1st Edition">1st Edition</option>
    <option value="Unlimited">Unlimited</option>
    <option value="Limited">Limited</option>
  </select>
</div>

            <div className={styles.field}>
              <label>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="mint">Mint</option>
                <option value="near_mint">Near Mint</option>
                <option value="light_played">Lightly Played</option>
                <option value="moderate_played">Moderately Played</option>
                <option value="heavy_played">Heavily Played</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Price (EGP)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {selectedCard?.images?.length > 0 && (
  <div className={styles.field}>
    <label>Choose official artwork</label>

    <div className={styles.artChoices}>
      {selectedCard.images.map((img, index) => (
        <button
          type="button"
          key={`${img.image_url}-${index}`}
          className={`${styles.artButton} ${
            selectedOfficialImage === img.image_url
              ? styles.artButtonActive
              : ""
          }`}
          onClick={() => handleOfficialArtSelect(img.image_url)}
        >
          <img
            src={img.image_url_small || img.image_url}
            alt={`${selectedCard.name} artwork ${index + 1}`}
          />
        </button>
      ))}
    </div>
  </div>
)}
          {selectedOfficialImage && (
            <div className={styles.officialPreview}>
              <img src={selectedOfficialImage} alt={selectedCard.name} />
            </div>
          )}

          <div className={styles.field}>
            <label>Upload your own photos</label>
            <div
              className={`${styles.uploadBox} ${isDragging ? styles.dragging : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={styles.uploadContent}>
                <span className={styles.uploadIcon}>📷</span>
                <p>
                  {sellerImages.length > 0
                    ? "Add more images"
                    : "Upload card images"}
                </p>
                <small>Drag and drop, choose files, or take a photo</small>

                <div className={styles.uploadActions}>
                  <label className={styles.uploadActionBtn}>
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleSellerFilesChange}
                      className={styles.fileInput}
                    />
                  </label>

                  <label className={styles.uploadActionBtn}>
                    Use Camera
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleSellerFilesChange}
                      className={styles.fileInput}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.uploadPreviewGrid}>
              {sellerImages.map((img) => (
                <div key={img.id} className={styles.previewItem}>
                  <img src={img.url} alt="Preview" />

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeImage(img.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention condition details, scratches, whitening, etc."
            />
          </div>

          {submitError && <p className={styles.submitError}>{submitError}</p>}
          

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish Listing"}
          </button>
        </form>
      </Container>
    </section>
  );
}
