/** @type {import('stylelint').Config} */
export default {
  root: true,
  extends: "@wordpress/stylelint-config/scss",
  rules: {
    "unit-allowed-list": {
      "line-height": ["px", "em", "rem", "unitless"]
    }
  }
};