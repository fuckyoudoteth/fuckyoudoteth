module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    /*
    live: {
      host: "localhost",
      port: 8080,
      network_id: 1,
      from: "0x007d2d5c4d8c4190f8ef67e35b24f6a79b946170"
    }
    */
  }
};
