//To enable wallet connect, an infuraID is needed, so this should be set first
KV.set_infuraID("f2be8a3bf04d4a528eb416566f7b5ad6");
//The wallet connection system can be then be initialised, and other dependency scripts can be added
KV.init(["/static/prod/KV.WalletUIHandler.latest.min.js"]).then(function (res) {
  let walletui = new KV.WalletUIHandler({
    parent_container: document.getElementById("connect_box"),
    btn_connect: document.getElementById("connect_btn"),
    modal_connect_headline: "",
    btn_disconnect_label: "Disconnect",
    web3network: KV.rpc_codes.ETH_MAINNET,
    buttonCustom: document.getElementById("kvwalletmodal_walletconnect_btn"),
    metaButton: document.getElementById("kvwalletmodal_metamask_btn")
  });
  walletui.on("btnconnect_clicked", function (activity_when) {
    console.log("btnconnect", activity_when);
  });
  walletui.on("modal_open", function (msg) {
    console.log("modal opened", msg);
  });
  walletui.on("modal_closed", function (msg) {
    console.log("modal closed", msg);
  });
  walletui.on("wallet_connecting", function (msg) {
    console.log("connecting", msg);
  });
  walletui.on("wallet_connected", function (msg) {
    console.log("connected", msg);
    KV.wallet.web3().eth.getAccounts().then(function (f) { console.log(f) })
    KV.wallet.web3().eth.getAccounts().then(function (account) {

      console.log(account)
      console.log("nonce " + nonce)
      var hex = ''
      for (var i = 0; i < nonce.length; i++) {
        hex += '' + nonce.charCodeAt(i).toString(16)
      }
      var hexMessage = "0x" + hex
      console.log(typeof hexMessage)
      console.log(typeof account)
      KV.wallet.web3().eth.personal.sign(hexMessage, account[0]).then(function (signature) {
        let link = "https://192.168.1.17:3000/wallet-link/validate_sign";



        if (account) {
          fetch(link, { method: "GET", headers: { pubKey: account, signature: signature } }).then((res) => {
            res.json().then((data) => {
              console.log(data);
              if (data.status === "ok") {
                fetch("/wallet-link/dapp", { method: "POST", headers: { wallet: 'WC', cryptoWalletSignature: signature } }).then((res) => {
                  document.location.href = res.url
                  console.log(res)
                })
              }
            });
          });
          console.log(account)
        }

      })
      /*KV.wallet.web3().eth.sign(KV.wallet.web3().eth.accounts.hashMessage(nonce), account[0]).then(function (signature) {
        console.log('signature:', signature)
        message=KV.wallet.web3().eth.accounts.hashMessage(nonce)
        let link = "https://192.168.1.17:3000/wallet-link/validate_sign";



        if (account) {
          fetch(link, { method: "GET", headers: { pubKey: account, signature: signature,message:message } }).then((res) => {
            res.json().then((data) => {
              console.log(data);
              if (data.status === "ok") {
                fetch("/wallet-link/dapp", { method: "POST", headers: { wallet: 'WC', cryptoWalletSignature: signature } }).then((res) => {
                  document.location.href = res.url
                  console.log(res)
                })
              }
            });
          });
          console.log(account)
        }

      })*/


    })
  });
  walletui.on("wallet_error", function (msg) {
    console.log("wallet err", msg);
  });
  walletui.on("wallet_disconnected", function (msg) {
    console.log("wallet disconnected", msg);
  });

}).catch(function (err) {
  console.error(err);
});
