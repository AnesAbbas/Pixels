// Helper function to set the icon and apply CSS based on the blur state
function updateIconAndCSS(tabId, domain, blur) {
    const iconPath = blur ? '1.png' : '-1.png';
    chrome.action.setIcon({ tabId, path: iconPath });

    const css = blur ? 
        'img { -webkit-filter: blur(5px);} img:hover{ -webkit-filter: blur(0px);}' : 
        'img { -webkit-filter: blur(0px);}';

    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        css: css
    }).catch((error) => {
        console.error("Failed to insert CSS: ", error);
    });
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' || changeInfo.status === 'complete') {
        const url = new URL(tab.url);
        const domain = url.hostname;

        // Get blur state
        chrome.storage.local.get([domain], (result) => {
            let blur = result[domain] ?? false;

            // Set icon and apply CSS based on the blur state
            updateIconAndCSS(tabId, domain, blur);

            // Save default blur state if not already set
            if (result[domain] === undefined) {
                chrome.storage.local.set({ [domain]: blur });
            }
        });
    }
});

// Listener for action (icon) clicks
chrome.action.onClicked.addListener((tab) => {
    const url = new URL(tab.url);
    const domain = url.hostname;

    // Single click: Toggle blur state
    chrome.storage.local.get(domain, (blurResult) => {
        let blur = blurResult[domain] ?? false;
        blur = !blur;

        chrome.storage.local.set({ [domain]: blur }, () => {
            updateIconAndCSS(tab.id, domain, blur);
        });
    });
});
