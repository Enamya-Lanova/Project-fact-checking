/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'verifyContent',
    title: 'Verify Content',
    contexts: ['link', 'image', 'selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const data = {
    type: info.menuItemId === 'verifyContent' ? 'verify' : 'analyze',
    url: info.linkUrl || info.srcUrl || tab?.url,
    text: info.selectionText,
    timestamp: new Date().toISOString()
  };

  chrome.runtime.sendMessage({
    action: 'VERIFY_CONTENT',
    payload: data
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
      return;
    }
    console.log('Message sent successfully:', response);
  });
});