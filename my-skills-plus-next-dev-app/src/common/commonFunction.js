// Function to generate a random color (excluding white)
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  do {
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === "#FFFFFF"); // Ensure the color is not white
  return color;
}

// Function to add light opacity to a given color
export function addLightOpacity(color, opacity) {
  // Validate input and set default opacity if not provided
  opacity = opacity >= 0 && opacity <= 1 ? opacity : 0.5;

  // Convert hex to RGB
  const hexToRgb = (hex) =>
    hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));

  const rgbColor = hexToRgb(color);

  // Return the color with light opacity
  return `rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, ${opacity})`;
}

// Generate first letter capitalized of a given word
export function capitalizeFirstLetter(word) {
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
  return capitalizedWord;
}

// Generate fullname
export function generateFullname(firstname, lastname) {
  const fullname =
    capitalizeFirstLetter(firstname) + " " + capitalizeFirstLetter(lastname);
  return fullname;
}

// change the format of localstorage data
export const sortRatingByLocalStorage = (inputData) => {
  const inputArray = inputData;
  let output = {};
  // console.log(inputData,"343423")

  for (const item of Object.keys(inputArray)) {
    const parentID = item?.parentSkillDetailId
      ? item?.parentSkillDetailId
      : item?.ancestors && item?.ancestors[0]?.path_addr;
    const parentName = item?.isot_file
      ? item.isot_file.tags[0].title
      : item.isot_skill?.tags[0].title;
    const superParentName = item?.parentSkillDetailId
      ? item?.parentSkillDetailId
      : item?.ancestors && item?.ancestors[0]?.path_addr;
    if (!output[parentName]) {
      output[parentName] = {
        parentID,
        parentName,
        superParentName,
        RatedSkills: [],
      };
    }

    const ratedSkill = {
      comment: item?.comment
        ? item?.comment
        : item?.ratings && item?.ratings[0].comment,
      rating: item?.rating
        ? item?.rating
        : item?.ratings && item?.ratings[0]?.rating,
      isot_file_id: item?.isot_file_id
        ? item?.isot_file_id
        : item?.isot_path_addr,
      isot_file: item?.isot_file ? item?.isot_file : item?.isot_skill,
      parentSkillDetailId: item?.parentSkillDetailId
        ? item?.parentSkillDetailId
        : item?.ancestors && item?.ancestors[0]?.path_addr,
      ratings: item.ratings,
    };

    output[parentName].RatedSkills.push(ratedSkill);
  };

  const finalResultArray = Object.values(output);

  return finalResultArray;
};

// social media instagram sharing
export const handleInstragramshare = ({ url, title }) => {
  window.open(`https://www.instagram.com/?url=${url}&title=${title}`, "_blank");
};

// social media linkedin sharing
export const handleLinkedInShare = ({ url, title }) => {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
    "_blank"
  );
};

// social media facebook sharing
export const handleFacebookInShare = ({ url, title }) => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`,
    "_blank"
  );
};

// avatar string name
export function stringAvatar(name) {
  return {
    sx: {
      color: "#007dfc",
      bgcolor: "transparent",
      border: `2px solid #007dfc`,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

// validation regex pattern
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const emailRegexMessage = "Invalid email address";
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[ -\/:-@\[-\`{-~]).{8,}$/i;

export const passwordRegexMessage =
  "Password must be contain at least a letter , a number , a special characters and minimum length 8 Ex-Secure!1";
