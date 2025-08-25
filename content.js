console.log("page loaded");

function findComponseToolbar() {
  const selectors = [
    ".btC",
    ".aDh",
    "[role='dialog'] .dC",
    "[role='toolbar']",
    ".gU.Up",
  ];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}
function createaAIButton() {
  const button = document.createElement("button");
  button.className = "aireply";
  button.innerText = "AI Reply";
  button.style.padding = "8px 12px";
  button.setAttribute("role", "button");
  button.style.marginRight = "8px";
  button.style.backgroundColor = "#1a73e8";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";
  button.style.fontWeight = "500";
  button.style.fontFamily = "Roboto, Arial, sans-serif";
  button.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)";
  button.style.transition = "background-color 0.3s ease";

  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#1669c1";
  });
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#1a73e8";
  });

  return button;
}

function getContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    "[role='presentation']",
    ".gU.Up",
  ];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) return content.innerText.trim();
  }
  return "";
}

function injectButton() {
  const exist = document.querySelector(".aireply");
  if (exist) exist.remove();
  const toolbar = findComponseToolbar();
  if (toolbar) {
    console.log("toolbar found");
    const button = createaAIButton();
    button.classList.add("aireply");
    button.addEventListener("click", async () => {
      try {
        button.innerHTML = "Generating ...";
        button.disabled = true;
        const emailContent = getContent();
        console.log(JSON.stringify({ emailContent, tone: "professional" }));
        console.log("email content:", emailContent);
        const resp = await fetch("http://localhost:8080/api/email/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailContent, tone: "professional" }),
        });
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        const reply = await resp.text();
        const box = document.querySelector(
          "[role='textbox'][g_editable='true']"
        );
        if (box) {
          box.focus();
          box.focus();
          document.execCommand("insertText", false, reply);

          button.innerHTML = "AI Reply";
          button.disabled = false;
        }
      } catch (e) {
        console.log(e);
      }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
  } else {
    console.log("toolbar not found");
  }
}

const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    const addedNodes = Array.from(m.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches(".dC, .btC, [role='dialog']") ||
          node.querySelector(".aDh, .btC, [role='dialog']"))
    );

    if (hasComposeElements) {
      console.log("compose window found");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
