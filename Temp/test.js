const FUNCTION_URL = "https://tzai-space.web.app/api/";
const data = { test: "hello" };

fetch(FUNCTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`HTTP ${response.status}: ${text}`);
      });
    }
    return response.json();
  })
  .then(result => console.log("成功回應：", result))
  .catch(error => console.error("發生錯誤：", error));
