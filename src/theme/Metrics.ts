import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("screen");

// iPhone X baseline; dimensions swap in landscape so scale ratios stay correct.
let guidelineBaseWidth = 375;
let guidelineBaseHeight = 812;

if (width > height) {
  [guidelineBaseWidth, guidelineBaseHeight] = [
    guidelineBaseHeight,
    guidelineBaseWidth,
  ];
}

const horizontalScale = (size: number): number =>
  (width / guidelineBaseWidth) * size;

const verticalScale = (size: number): number =>
  (height / guidelineBaseHeight) * size;

// factor tunes how much spacing grows between smaller and larger screens.
const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export { height, horizontalScale, moderateScale, verticalScale, width };
