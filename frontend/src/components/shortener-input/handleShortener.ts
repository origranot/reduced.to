import confetti from "canvas-confetti";
import QRCode from "qrcode";

  // Generates the QR code for the shortened url
export function generateQRCode(){
    const result = document.querySelector("#qrcode")
    const url = document.querySelector("#result #text")!.textContent || ""

    result!.classList.replace("hidden", "flex")

    QRCode.toCanvas(document.querySelector("#qrcode canvas"), url, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }

  // Downloads the QR code
export function downloadQRCode() {
    const canvas = document.querySelector("#qrcode canvas") as HTMLCanvasElement
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = "qrcode.png"
    a.click()
}

export function confettiAnimate() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 0,
      y: 0.8,
    },
  });
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 1,
      y: 0.8,
    },
  });
}

export function copyUrl({ state }: any) {
  const result = document.querySelector("#result #text");
  navigator.clipboard.writeText(result!.textContent!);

  if (!state.showAlert) {
    state.showAlert = true;
  }
}

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string) => {
  let result;
  try {
    result = await fetch("/api/v1/shortener", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl }),
    });
  } catch (err) {
    return null;
  }
  return result.json();
};

export function openLink() {
  const text = document.querySelector("#result #text")!.textContent;
  window.open(text!, "_blank");
}

export async function handleShortener({ state }: any) {
  const result = document.getElementById("result");
  const loader = document.getElementById("loading");
  const urlInput = document.getElementById("urlInput") as HTMLInputElement;

  loader!.classList.replace("hidden", "block");
  result!.classList.replace("block", "hidden");

  const { newUrl } = await getShortenUrl(urlInput!.value);

  // Remove the loader from the screen
  loader!.classList.replace("block", "hidden");
  result!.classList.replace("hidden", "block");

  urlInput.value = "";

  if (!newUrl) {
    result!.querySelector("#error")!.textContent = "This url is invalid..";
    result!.querySelector("#text")!.textContent = "";
    result!.querySelector("#action")!.classList.replace("block", "hidden");
    return;
  }

  result!.querySelector("#error")!.textContent = "";
  result!.querySelector("#text")!.textContent = window.location.href + newUrl;
  result!.querySelector("#action")!.classList.replace("hidden", "block");

  state.showAlert = true;
  copyUrl({state});
  confettiAnimate();
}

