export default () => {
  // if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log(" SSL validation disabled for development.");
  // }
};
