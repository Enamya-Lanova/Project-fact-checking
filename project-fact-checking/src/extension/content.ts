chrome.runtime.onMessage.addListener(
  (
    request: { action: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: { url: string; selectedText: string; timestamp: string }) => void
  ) => {
    if (request.action === 'CAPTURE_VISIBLE_TAB') {
      const url = window.location.href;

      const selectedText = window.getSelection()?.toString() || '';

      sendResponse({
        url,
        selectedText,
        timestamp: new Date().toISOString(),
      });
    }
    return true;
  }
);