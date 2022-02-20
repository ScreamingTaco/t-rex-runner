
// connect to NEAR
const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org'
});

// connect to the NEAR Wallet
const wallet = new nearApi.WalletConnection(near, 'jeffrey_the_running_dinosaur');
const accountId = wallet.getAccountId();

// connect to a NEAR smart contract
const contract = new nearApi.Contract(wallet.account(), 'jeffrey_the_dinosaur.testnet', {
  viewMethods: ['ft_balance_of', 'storage_balance_bounds'],
  changeMethods: ['ft_transfer', 'storage_balance_of', 'storage_deposit']
});

const nfts = new nearApi.Contract(wallet.account(), 'example-nft.testnet', {
  viewMethods: ['nft_tokens_for_owner', 'TokenMetadata', 'JsonToken']
  // changeMethods: ['ft_transfer', 'storage_balance_of', 'storage_deposit']
});

// set the initial button text

const button = document.getElementById("login-btn")

if (!wallet.isSignedIn()) {
  button.textContent = 'SignIn with NEAR';
} else {
  button.textContent = 'Sign ' + wallet.getAccountId() + ' out';
  updateStats()
}

button.addEventListener("click", loginBtn)

function loginBtn() {
  // controls login button text and functionality
  const button = document.getElementById("login-btn")
  if (wallet.isSignedIn()) {
    wallet.signOut();
    console.log("Signing out")
    skins = document.getElementById("skins")
    skins.innerHTML = ""
    updateSkin("assets/dino.dino_default_2.0.png")
    button.textContent = 'SignIn with NEAR';
  } else {
    wallet.requestSignIn({
      contractId: 'jeffrey_the_dinosaur.testnet',
      methodNames: ['ft_balance_of']
    });
    if (wallet.isSignedIn()) {
      button.textContent = 'Sign ' + wallet.getAccountId() + ' out';
      updateStats()
    } else {
      console.log("Login failure")
    }
  }
}

function updateStats() {
  // contract.ft_balance_of({
  //   account_id: wallet.getAccountId()
  // })
  //   .then(messages => {
  //     console.log("Raw Balance: " + messages);
  //     balance = parseFloat(messages) / 100000000
  //     console.log("Balance adjusted for decimal: " + balance)
  //     balance_text = document.getElementById('balance')
  //     balance_text.textContent = "$DINO: " + balance
  //   });
  nfts.nft_tokens_for_owner({
    account_id: accountId
  }).then(messages => {
    var dino_tokens = [] // holds the images for our dino tokens
    for (i in messages) {
      token_id = messages[i].token_id
      // check if its a dino one
      if (token_id.slice(0, 5) == "dino.") {
        dino_tokens.push(messages[i].metadata.media)
      }
    }
    var skins = document.getElementById("skins")
    skins.innerHTML = "";
    for (i in dino_tokens) {
      li = document.createElement("li")
      img = document.createElement("img")
      img.src = dino_tokens[i];
      img.className = "skin";

      li.appendChild(img)
      skins.appendChild(li)
      skins.lastChild.id = i
    }
    // add click event listener

    const childern = skins.childNodes;

    // iterate over all child nodes
    childern.forEach(li => {
      li.addEventListener("click", function () {
        // clear skin selection
        for (elem of document.getElementsByClassName("selected")) {
          elem.classList.remove("selected");
        }
        updateSkin(li.firstChild.src)
        li.className += "selected"
      })
      console.log(li.firstChild.src);
    });
  });
}

function updateSkin(src) {
  document.getElementById("spritesheet").src = src
  Runner.imageSprite = document.getElementById('spritesheet')
}

document.addEventListener('DOMContentLoaded', function () {
  if (wallet.isSignedIn()) { updateStats }
});

// TODO: Implement this
// amount is in the smallest denomination of dino coins (which goes to 8 decimal places)
// function transfer(amount) {
//   // first: check to make sure the player has a storage deposit. Create one if not
//   // TODO: implement this check. For now, we assume that everyone who plays has enough
//   // seconed: transfer 
//   contract.ft_transfer({
//     receiver_id: wallet.getAccountId(),
//     amount: amount.toString()
//   },
//     "300000000000000", // attached GAS (optional)
//     "1" // attached deposit in yoctoNEAR (optional)
//   )
//     .then(messages => {
//       console.log(messages)
//     });
// }