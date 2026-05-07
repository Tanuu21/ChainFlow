// =======================================
// CHAINDESK APP
// =======================================

const connectWalletBtn =
document.getElementById("connectWallet");

const ethBalance =
document.getElementById("ethBalance");

const walletAddress =
document.getElementById("walletAddress");

const gasFee =
document.getElementById("gasFee");

const portfolioValue =
document.getElementById("portfolioValue");

const marketGrid =
document.getElementById("marketGrid");

// =======================================
// CONNECT WALLET
// =======================================

connectWalletBtn.onclick = async () => {

  if(!window.ethereum){

    alert("Install MetaMask");

    return;
  }

  try{

    const provider =
    new ethers.providers.Web3Provider(window.ethereum);

    await provider.send(
      "eth_requestAccounts",
      []
    );

    const signer =
    provider.getSigner();

    const address =
    await signer.getAddress();

    const balance =
    await provider.getBalance(address);

    const eth =
    ethers.utils.formatEther(balance);

    ethBalance.innerText =
    parseFloat(eth).toFixed(4);

    walletAddress.innerText =
    address;

    connectWalletBtn.innerText =
    "Connected";

  }catch(err){

    console.log(err);

  }

};

// =======================================
// LOAD GAS FEES
// =======================================

async function loadGas(){

  try{

    const res =
    await fetch(
      "https://api.blocknative.com/gasprices/blockprices"
    );

    const data =
    await res.json();

    gasFee.innerText =
    data.blockPrices[0]
    .estimatedPrices[0]
    .price + " Gwei";

  }catch(err){

    gasFee.innerText =
    "Unavailable";

  }

}

loadGas();

// =======================================
// LOAD MARKET DATA
// =======================================

async function loadMarket(){

  try{

    const res =
    await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,chainlink"
    );

    const data =
    await res.json();

    marketGrid.innerHTML = "";

    let total = 0;

    data.forEach((coin)=>{

      total += coin.current_price;

      marketGrid.innerHTML += `

        <div class="glass p-6 rounded-3xl card-hover">

          <div class="flex items-center gap-4">

            <img
            src="${coin.image}"
            class="w-12 h-12"/>

            <div>

              <h2 class="font-bold text-xl">
                ${coin.name}
              </h2>

              <p class="text-gray-400 uppercase">
                ${coin.symbol}
              </p>

            </div>

          </div>

          <div class="mt-6">

            <h2 class="text-3xl font-bold">
              $${coin.current_price.toLocaleString()}
            </h2>

            <p class="
            mt-2
            ${coin.price_change_percentage_24h > 0
              ? 'text-green-400'
              : 'text-red-400'
            }">

              ${coin.price_change_percentage_24h.toFixed(2)}%

            </p>

          </div>

        </div>

      `;

    });

    portfolioValue.innerText =
    "$" + total.toLocaleString();

  }catch(err){

    console.log(err);

  }

}

loadMarket();

// =======================================
// WALLET ANALYZER
// =======================================

async function analyzeWallet(){

  const wallet =
  document.getElementById("walletInput").value;

  const walletResult =
  document.getElementById("walletResult");

  if(wallet.length < 20){

    walletResult.innerHTML =
    `<span class="text-red-400">
      Invalid wallet address
    </span>`;

    return;
  }

  walletResult.innerHTML =
  "Scanning wallet...";

  try{

    const res =
    await fetch(
      `https://api.ethplorer.io/getAddressInfo/${wallet}?apiKey=freekey`
    );

    const data =
    await res.json();

    let risk = "Low";

    if(data.countTxs > 500){
      risk = "Medium";
    }

    if(data.countTxs > 2000){
      risk = "High";
    }

    walletResult.innerHTML = `

      <div class="space-y-4">

        <div class="glass p-5 rounded-2xl">

          <p class="text-gray-400">
            Address
          </p>

          <h2 class="font-bold break-all mt-2">
            ${wallet}
          </h2>

        </div>

        <div class="glass p-5 rounded-2xl">

          <p class="text-gray-400">
            Transactions
          </p>

          <h2 class="font-bold mt-2">
            ${data.countTxs || 0}
          </h2>

        </div>

        <div class="glass p-5 rounded-2xl">

          <p class="text-gray-400">
            Risk Level
          </p>

          <h2 class="
          font-bold mt-2
          ${risk === "Low"
            ? "text-green-400"
            : risk === "Medium"
            ? "text-yellow-400"
            : "text-red-400"
          }">

            ${risk}

          </h2>

        </div>

      </div>

    `;

  }catch(err){

    walletResult.innerHTML =
    `<span class="text-red-400">
      Failed to scan wallet
    </span>`;

  }

}

// =======================================
// CHART
// =======================================

const ctx =
document.getElementById("portfolioChart");

new Chart(ctx,{

  type:"line",

  data:{

    labels:[
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ],

    datasets:[{

      label:"Portfolio",

      data:[
        1200,
        1900,
        1400,
        2500,
        2200,
        3200,
        4200
      ],

      borderColor:"#8b5cf6",

      backgroundColor:
      "rgba(139,92,246,.2)",

      tension:.4,

      fill:true

    }]

  },

  options:{

    responsive:true,

    plugins:{

      legend:{
        labels:{
          color:"white"
        }
      }

    },

    scales:{

      x:{
        ticks:{
          color:"white"
        }
      },

      y:{
        ticks:{
          color:"white"
        }
      }

    }

  }

});