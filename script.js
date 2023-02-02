/**
 * Return iframe window object 
 */
function getIframeWindow(iframeEl) {
    let doc;
    if (iframeEl.contentWindow) {
        return iframeEl.contentWindow;
    }
    if (iframeEl.window) {
        return iframeEl.window;
    }
    if (!doc && iframeEl.contentDocument) {
        doc = iframeEl.contentDocument;
    }
    if (!doc && iframeEl.document) {
        doc = iframeEl.document;
    }
    if (doc && doc.defaultView) {
        return doc.defaultView;
    }
    if (doc && doc.parentWindow) {
        return doc.parentWindow;
    }
    return undefined;
}

/**
 * Handle iframe events.
 * Each event has `callbackType` and `data` attributes. You can find the details in the documentation.
 * @param event - event object when an action is completed on iframe or an error happens or a data is being passed from iframe.
 */
function handleMessage(event) {
    const data = JSON.stringify(event.data);
    console.log(data);

    if (event.data.callbackType === 'Production') {
        /**
         * event.data.data = {
         *  yearlyProduction,
         *  monthlyProduction,
         *  numTotalPanels,
         *  numSelectedPanels,
         *  systemSize,
         * }
         */
        $('#production').val(event.data.data.yearlyProduction);
    }

    if (event.data.callbackType === 'NewLead') {
        $('#lead-id').val(event.data.data);
    }

    if (event.data.callbackType === 'NewProposal') {
        $('#proposal-id').val(event.data.data);
    }

    if (event.data.callbackType === 'Error') {
        $('#message-box').text(data);
    }

    if (event.data.callbackType === 'ShadingValues') {
        $('#message-box').text(JSON.stringify(event.data.data));
    }

    if (event.data.callbackType === 'RoofOrientation') {
        $('#message-box').text(JSON.stringify(event.data.data));
    }

    if (event.data.callbackType === 'ProductionPerPanel') {
        $('#message-box').text(JSON.stringify(event.data.data));
    }
}

/**
 * This function is used to send messages from client to the iframe window.
 * The details of acceptable messages are available in documentation.
 * @param msg - message
 */
function sendMessage(msg) {
    const el = document.getElementById('aerialytic-iframe');
    const iframeWindow = getIframeWindow(el);
    iframeWindow.postMessage(msg, '*');
}

/**
 * This function is used to start an automatic solar design process in the iframe window.
 */
function generate() {
    const coordinates = $('#coordinates').val();
    const usage = Number($('#usage').val());

    try {
        sendMessage({
            cmd: 'generate',
            params: {
                coordinates, 
                electricity_usage: usage,
            },
            // optional, if not provided the default values set in the software will be used
            config: {
                setback: 2, // inch
                buffer: 0.5, // inch
                panel: {
                    manufacturer: 'REC',
                    dimensions: { length: 1821, width: 890 },
                    degradation: 0.26, // %
                    efficiency: 21.6, // %
                    has_micro: false,
                    model: 'REC400AA',
                    power: 400,
                },
                inverter: {
                    capacity: 10000,
                    efficiency: 96.0, // %
                    model: 'Enphase',
                    type: 'Central', // 'Micro' | 'Central'
                },
                defaultBtnView: {
                    ShadingSimulator: true,
                    Ground: false,
                    Trees: true,
                    FireSetbacks: true,
                    Panels: false,
                    House: true,
                    ShadingGradients: true,
                    DSM: true,
                    HouseDSM: true,
                },
            },
        });
    } catch (err) {
        console.log(err);
    }
    
}

/**
 * This function is used to load an old solar design in the iframe window
 */
function loadProposal() {
    const uid = $('#lead-id').val();
    const pid = $('#proposal-id').val();

    try {
        sendMessage({
            cmd: 'proposal.LoadProposal',
            params: { uid, pid },
            config: {
                defaultBtnView: {
                    ShadingSimulator: true,
                    Ground: false,
                    Trees: true,
                    FireSetbacks: true,
                    Panels: false,
                    House: true,
                    ShadingGradients: true,
                    DSM: true,
                    HouseDSM: true,
                },
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function getShadingValues() {
    try {
        sendMessage({
            cmd: 'proposal.ShadingValues',
            params: { }
        });
    } catch (err) {
        console.log(err);
    }
}

function getRoofOrientation() {
    try {
        sendMessage({
            cmd: 'proposal.RoofOrientation',
            params: { }
        });
    } catch (err) {
        console.log(err);
    }
}

function getProductionPerPanel() {
    try {
        sendMessage({
            cmd: 'proposal.ProductionPerPanel',
            params: { }
        });
    } catch (err) {
        console.log(err);
    }
}

function handleFunc() {
    let selectVal = document.getElementById('func').value;
    if (selectVal === '1') {
        getShadingValues();
    } else if (selectVal === '2') {
        getRoofOrientation();
    } else if (selectVal === '3') {
        getProductionPerPanel();
    }
}
